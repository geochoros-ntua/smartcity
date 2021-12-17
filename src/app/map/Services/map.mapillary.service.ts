import { Injectable } from '@angular/core';
import * as mapillary from 'mapillary-js';
import * as olProj from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { MapLayersService } from './map.layers.service';
import { DetectionFeature, SmartCityMapillaryConfig } from '../api/map.interfaces';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapillaryViewerModalComponent } from '../Controls/mapillary-viewer-modal/mapillary-viewer-modal.component';
import { boundingExtent, Extent, getArea, containsXY } from 'ol/extent';
import { Observable } from 'rxjs';
import Geometry from 'ol/geom/Geometry';

@Injectable({
    providedIn: 'root'
})
export class MapMapillaryService {

    private MPL_KEY = 'MLY|4195156090570097|6a0d147f286068b5fc9a83bb734dc467';
    private MPL_DETECTIONS_URL = 'https://smartcity.fearofcrime.com/php/loadMplDetections.php';
    private viewer: mapillary.Viewer;
    private mapillaryDialogRefP: MatDialogRef<MapillaryViewerModalComponent> = null;
    private tagComponent: mapillary.TagComponent;
    private removeDetection: boolean = false;
    

    constructor(private http: HttpClient, public dialog: MatDialog, private mapLayersService: MapLayersService) { }

    public get mapillaryViewer(): mapillary.Viewer {
        return this.viewer;
    }

    public get mapillaryDialogRef(): MatDialogRef<MapillaryViewerModalComponent>{
        return this.mapillaryDialogRefP;
    }

    public initMapillaryViewer(smartCityMapillaryConfig: SmartCityMapillaryConfig): void {
        
        const options: mapillary.ViewerOptions = {
            accessToken: this.MPL_KEY,
            component: {
                cover: false,
                tag: smartCityMapillaryConfig.detection ? true : false
            },
            container: smartCityMapillaryConfig.mapillaryDivId,
            cameraControls: mapillary.CameraControls.Street,
            imageId: smartCityMapillaryConfig.imageId + ''
        };
        this.viewer = new mapillary.Viewer(options);
        // add any filters. It seems they dont work
        // this.viewer.setFilter(['==', 'creatorId', '1805883732926354']);
        // this.viewer.setFilter(['==', 'sequenceId', 'oOKk2ZLL-uTMKcUKlDzj9g']);
        // this.viewer.setFilter(["in", "creatorId", "1805883732926354"]);
        this.tagComponent = this.viewer.getComponent('tag');
        this.tagComponent.removeAll();
        if (smartCityMapillaryConfig.detection){
            const detections = [];
            smartCityMapillaryConfig.detection.geometry.forEach( (geom, i) => {
                const coordinates = geom.coordinates;
                coordinates.push(coordinates[0])
                const tagGeometry: mapillary.PolygonGeometry = new mapillary.PolygonGeometry(coordinates);
                const objOptions: mapillary.OutlineTagOptions = {
                    domain: mapillary.TagDomain.ThreeDimensional,
                    fillColor: 0x0000ff,
                    fillOpacity: 0.4,
                    lineColor: 0xff0000,
                    lineWidth: 3,
                    text: smartCityMapillaryConfig.detection.value,
                    textColor: 0xffffff,
                };
                const detection = new mapillary.OutlineTag('clicked-tag-'+i, tagGeometry, objOptions);  
                detections.push(detection);
            })
            this.tagComponent.add(detections);
        }    
    }

    public showMapillaryViewer(smartCityMapillaryConfig: SmartCityMapillaryConfig): void {
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

        this.mapillaryDialogRefP.afterClosed().subscribe( _ => {
            this.removeMapillaryViewer();
        });

        this.mapillaryDialogRefP.afterOpened().subscribe( _ => {
            this.initMapillaryViewer(smartCityMapillaryConfig);
            this.registerMplViewerEvents(smartCityMapillaryConfig.map);
        });
    }

    public removeMapillaryViewer() {
        this.mapillaryViewer?.remove();
        this.mapLayersService.SelectionLayer.getSource().clear();
    }

    private registerMplViewerEvents(map: Map): void {

        this.mapillaryViewer.on('image', async (event: mapillary.ViewerImageEvent) => {
            const coord = olProj.transform([event.image.originalLngLat.lng, event.image.originalLngLat.lat], 'EPSG:4326', 'EPSG:3857');
            const extent: Extent = map.getView().calculateExtent(map.getSize());
            if (!containsXY(extent, coord[0], coord[1])) {
                map.getView().animate({
                    center: coord,
                    duration: 1000
                  });
            }
            const selFeature = new Feature({
                name: 'selected',
                id: event.image.id,
                compass_angle: event.image.compassAngle,
                geometry: new Point(coord)
            });
            this.mapLayersService.SelectionLayer.getSource().clear();
            this.mapLayersService.SelectionLayer.getSource().addFeature(selFeature);
            if (this.removeDetection){
                this.tagComponent.removeAll();  
            }
            this.removeDetection = true;

        });
    }

    public showFeatureOnImage(mapillaryViewerConfig: SmartCityMapillaryConfig, feature: Feature<Geometry>){
        const featid = feature.get('feature_id');
        this.http.get(this.MPL_DETECTIONS_URL + '?feature_id='+featid)
        .subscribe((result: any[]) => {
            // This is trivial
            // There are varius images related to the feature. More than 3 for sure.
            // We do select the one holding the geometry with the largest @boundingExtent
            const feature: DetectionFeature = result
            .map(df => {
                return {...df, geometry: eval(df.geometry), extentArea: eval(df.geometry)
                    .map( (gg: { coordinates: number[][] }) => boundingExtent(gg.coordinates))
                    .map( (ext: number[]) => getArea(ext))
                    .reduce((a: number, b: number) => a + b)}
            })
            .sort((a: DetectionFeature, b: DetectionFeature) => (a.extentArea < b.extentArea) ? 1 : -1)[0];
            const newConfig = {...mapillaryViewerConfig, imageId: feature.image_id, detection: feature};
            this.removeDetection = false;
            this.showMapillaryViewer(newConfig);
        });
    }
}
