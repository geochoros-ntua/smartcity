import { Injectable } from '@angular/core';
import * as mapillary from 'mapillary-js';
import * as olProj from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { MapLayersService } from './map.layers.service';
import { DetectionFeature, DetectionFeatureDB, DetectionGeometry, SmartCityMapillaryConfig } from '../api/map.interfaces';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapillaryViewerModalComponent } from '../Controls/mapillary-viewer-modal/mapillary-viewer-modal.component';
import { boundingExtent, Extent, getArea, containsXY } from 'ol/extent';
import Geometry from 'ol/geom/Geometry';
import RenderFeature from 'ol/render/Feature';
import { Coordinate } from 'ol/coordinate';

@Injectable({
    providedIn: 'root'
})
export class MapMapillaryService {

    private MPL_KEY = 'MLY|4195156090570097|6a0d147f286068b5fc9a83bb734dc467';
    private MPL_DETECTIONS_URL = 'https://smartcity.fearofcrime.com/php/loadMplDetections.php';
    private viewer!: mapillary.Viewer;
    private mapillaryDialogRefP!: MatDialogRef<MapillaryViewerModalComponent>;
    public tagComponent!: mapillary.TagComponent;
    private viewerBearing!: number;

    public selFeature!: Feature<Point>;
    public removeDetection!: boolean;
    public mplConfig!: SmartCityMapillaryConfig;
    public mplPopupClass = 'mapillaryViewer';



    constructor(private http: HttpClient, public dialog: MatDialog, private mapLayersService: MapLayersService) { }

    public get mapillaryViewer(): mapillary.Viewer {
        return this.viewer;
    }

    public get mapillaryDialogRef(): MatDialogRef<MapillaryViewerModalComponent>{
        return this.mapillaryDialogRefP;
    }

    /**
     * Initialise the mapillary viewer
     * This is fired when clicking in any mpl object on map
     * either lines | points | features
     * @param smartCityMapillaryConfig 
     */
    public initMapillaryViewer(smartCityMapillaryConfig: SmartCityMapillaryConfig): void {
        const options: mapillary.ViewerOptions = {
            accessToken: this.MPL_KEY,
            trackResize: true,
            component: {
                cover: false,
                tag: smartCityMapillaryConfig.detection ? true : false
            },
            container: smartCityMapillaryConfig.mapillaryDivId,
            cameraControls: mapillary.CameraControls.Street,
            imageId: smartCityMapillaryConfig.imageId + '',
        };
        this.viewer = new mapillary.Viewer(options);
        this.tagComponent = this.viewer.getComponent('tag');
        this.tagComponent.removeAll();
        // when clicking on feature
        // draw it also to the image
        if (smartCityMapillaryConfig.detection){
            const detections:mapillary.OutlineTag[] = [];
            smartCityMapillaryConfig.detection.geometries.forEach( (geom, i) => {
                const coordinates = geom.coordinates;
                coordinates.push(coordinates[0]);
                const tagGeometry: mapillary.PolygonGeometry = new mapillary.PolygonGeometry(coordinates);
                const objOptions: mapillary.OutlineTagOptions = {
                    domain: mapillary.TagDomain.TwoDimensional,
                    fillColor: 0x0000ff,
                    fillOpacity: 0.5,
                    lineColor: 0xff0000,
                    lineWidth: 5,
                    text: smartCityMapillaryConfig.detection?.value,
                    textColor: 0xffffff,
                };
                const detection = new mapillary.OutlineTag('clicked-tag-' + i, tagGeometry, objOptions);
                detections.push(detection);
            });
            
            this.tagComponent.add(detections);
            // zoom to the average center of detection features
            this.viewer.setCenter(
                detections
                .map( det => det.geometry.getCentroid2d())
                .reduce((a: number[], b: number[]) => [(a[0] + a[1])/2, (b[0] + b[1])/2])
            );
        }
        // used when toggling full screen
        if (smartCityMapillaryConfig.imageCenter){
            this.viewer.setCenter(smartCityMapillaryConfig.imageCenter);
        }
    }


    /**
     * custom modal holding the mpl viewer
     * @param smartCityMapillaryConfig 
     */
    public showMapillaryViewer(smartCityMapillaryConfig: SmartCityMapillaryConfig): void {
        this.mplConfig = smartCityMapillaryConfig;
        this.mapillaryDialogRefP?.close();
        this.removeMapillaryViewer();
        this.mapillaryDialogRefP = this.dialog.open( MapillaryViewerModalComponent, {
            panelClass: 'mpl_viewer_custom_popup',
            hasBackdrop: false,
            position: {
              bottom: '0.0em',
              left: '0.0em',
            }
          });

        this.mapillaryDialogRefP.afterClosed().subscribe( () => {
            this.removeMapillaryViewer();
        });

        this.mapillaryDialogRefP.afterOpened().subscribe( () => {
            this.initMapillaryViewer(smartCityMapillaryConfig);
            this.registerMplViewerEvents(smartCityMapillaryConfig.map);
        });
    }

    public removeMapillaryViewer(): void {
        this.mapillaryViewer?.remove();
        this.mapLayersService.SelectionLayer.getSource().clear();
    }

    /**
     * Register mplr viewer events. image | bearing
     * This is happening when moving around.
     * @param map 
     */
    private registerMplViewerEvents(map: Map): void {
        // event when bearing on viewer set feature azimuth
        this.mapillaryViewer.on('bearing', (event: mapillary.ViewerBearingEvent) => {
            this.viewerBearing = event.bearing;
            this.selFeature.set('compass_angle', event.bearing);
        });

        // event when image changes. Draw point on map....
        this.mapillaryViewer.on('image', async (event: mapillary.ViewerImageEvent) => {
            const coord: Coordinate = olProj.transform([event.image.originalLngLat.lng, event.image.originalLngLat.lat], 'EPSG:4326', 'EPSG:3857');
            const extent: Extent = map.getView().calculateExtent(map.getSize());
            if (!containsXY(extent, coord[0], coord[1])) {
                map.getView().animate({
                    center: coord,
                    duration: 1000
                  });
            }

            this.selFeature = new Feature({
                name: 'selected',
                id: event.image.id,
                compass_angle: this.viewerBearing ? this.viewerBearing : event.image.compassAngle,
                geometry: new Point(coord)
            });
            this.mapLayersService.SelectionLayer.getSource().clear();
            this.mapLayersService.SelectionLayer.getSource().addFeature(this.selFeature);
            if (this.removeDetection){
                this.tagComponent.removeAll();
            }
            this.removeDetection = true;
        });
    }

    public showFeatureOnImage(mapillaryViewerConfig: SmartCityMapillaryConfig, feature: Feature<Geometry> | RenderFeature): void {
        const featid = feature.get('feature_id');
        this.http.get(this.MPL_DETECTIONS_URL + '?feature_id=' + featid)
        .subscribe((result) => {
            // This is trivial
            // There are varius images related to the feature. More than 3 for sure.
            // We do select the one holding the geometry with the largest @boundingExtent
            const detectfeature: DetectionFeature = (result as DetectionFeatureDB[])
            .map(df => {
                const geometries: DetectionGeometry[] = JSON.parse(df.geometry.replace(/'/g, '"'));
                return {...df, geometries, extentArea: geometries
                    .map( (gg: { coordinates: number[][] }) => boundingExtent(gg.coordinates))
                    .map( (ext: number[]) => getArea(ext))
                    .reduce((a: number, b: number) => a + b)};
            })
            .sort((a: DetectionFeature, b: DetectionFeature) => (a.extentArea < b.extentArea) ? 1 : -1)[0];
            const newConfig = {...mapillaryViewerConfig, imageId: detectfeature.image_id, detection: detectfeature};
            this.removeDetection = false;
            this.showMapillaryViewer(newConfig);
        });
    }
}
