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
import { AppMessagesService } from '../../shared/messages.service';
import { Alignment, Popup } from 'mapillary-js';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';



@Injectable({
    providedIn: 'root'
})


export class MapMapillaryService {

    private MPL_KEY = 'MLY|4195156090570097|6a0d147f286068b5fc9a83bb734dc467';
    private MPL_DETECTIONS_URL = 'https://smartcity.fearofcrime.com/php/loadMplDetections.php';
    private MPL_ALL_DETECTIONS_URL = 'https://smartcity.fearofcrime.com/php/loadAllMplDetections.php';

    private viewer!: mapillary.Viewer;
    private mapillaryDialogRefP!: MatDialogRef<MapillaryViewerModalComponent>;
    private viewerBearing!: number;

    public tagComponent!: mapillary.TagComponent;
    public popupComponent!: mapillary.PopupComponent;
    public selFeature!: Feature<Point>;
    public removeDetection!: boolean;
    public mplConfig!: SmartCityMapillaryConfig;
    public mplPopupClass = 'mapillaryViewer';
    private translatePipe: TranslatePipe;



    constructor(
        private http: HttpClient, 
        public dialog: MatDialog, 
        private mapMessagesService : AppMessagesService,
        private mapLayersService: MapLayersService,
        private service: TranslateService) { 
            
         this.translatePipe = new TranslatePipe(this.service);
        }

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
                popup: true,
                tag: smartCityMapillaryConfig.detections ? true : false
            },
            container: smartCityMapillaryConfig.mapillaryDivId,
            cameraControls: mapillary.CameraControls.Street,
            imageId: smartCityMapillaryConfig.imageId + '',
        };
        this.viewer = new mapillary.Viewer(options);
        // set the filters
        this.viewer.setFilter([
            'all',
            // ['==', 'creatorUsername', 'zaf3kala'],
            ['==', 'cameraType', 'spherical'],
            ['>', 'capturedAt', new Date(2021, 11, 1).getTime()],
            ['<=', 'capturedAt', new Date(2022, 12, 31).getTime()]
          ]);


        this.tagComponent = this.viewer.getComponent('tag');
        this.tagComponent.removeAll();

        this.popupComponent = this.viewer.getComponent('popup');
        this.popupComponent.removeAll();

        // when clicking on feature
        // draw it also to the image
        if (smartCityMapillaryConfig.detections){
            const detections: mapillary.OutlineTag[] = smartCityMapillaryConfig.detections
            .flatMap( (dt, i) => {
                const detectionsInner = dt.geometries.map((gg,j) => {
                    const coordinates = gg.coordinates;
                    coordinates.push(coordinates[0]);
                    const tagGeometry: mapillary.PolygonGeometry = new mapillary.PolygonGeometry(coordinates);
                    const objOptions: mapillary.OutlineTagOptions = {
                        domain: mapillary.TagDomain.TwoDimensional,
                        fillColor: 0x0000ff,
                        fillOpacity: 0.5,
                        lineColor: 0xff0000,
                        lineWidth: 5,
                        text: smartCityMapillaryConfig.detections ? dt.value : '',
                        textColor: 0xffffff,
                    };
                    const detection = new mapillary.OutlineTag(
                        'clicked-tag-' + i + j + '--' + (smartCityMapillaryConfig.detections ? dt.value : ''), 
                        tagGeometry, 
                        objOptions
                        );
                    return detection;
                });
                return detectionsInner;
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
        this.mapillaryViewer.on('image', (event: mapillary.ViewerImageEvent) => {
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

        this.mapillaryViewer.on('mousemove', (event: mapillary.ViewerMouseEvent) => {
            this.tagComponent.getTagIdsAt(event.pixelPoint).then( tgids => {
                const tagId = tgids.length ? tgids[0] : null;
                this.popupComponent.removeAll();
                if (tagId){
                    this.popuOnHover(event.basicPoint, tagId);
                }
            });
        });
    }

    /**
     * Hover mouse pointer over tag action
     * @param pixelPoint 
     * @param label 
     */
    private popuOnHover(pixelPoint: number[],label: string): void{
        const featureSpan = document.createElement('span');
        featureSpan.style.backgroundColor = '#505050';
        featureSpan.style.padding = '5px 10px';
        featureSpan.style.color = '#fff';
        featureSpan.style.fontSize = '12px';
        const labelPcs = label.split('--');

        featureSpan.textContent = labelPcs[labelPcs.length-2] + '(' + labelPcs[labelPcs.length-1] + ')';
        const featurePopup = new Popup({   
            capturePointer: false,
            clean: true,
            float: Alignment.Right,
            offset: 10,
            opacity: 0.8,
        });
        featurePopup.setDOMContent(featureSpan);
        featurePopup.setBasicPoint(pixelPoint);

        this.popupComponent.add([featurePopup]);
    }

    /**
     * When clicking on a point
     * draw the feature over the image
     * @param mapillaryViewerConfig 
     * @param feature 
     */
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
            const newConfig = {...mapillaryViewerConfig, imageId: detectfeature.image_id, detections: [detectfeature]};
            this.removeDetection = false;
            this.showMapillaryViewer(newConfig);
        });
    }

    /**
     * Show all possible detections found for the current displayed image
     */
    public showAllImageDetections(): void{
        
        this.tagComponent.removeAll();
        this.http.get(this.MPL_ALL_DETECTIONS_URL + '?image_id=' +  this.selFeature.get('id'))
        .subscribe((result) => {
            this.mapMessagesService.showMapMessage({
                    message: this.translatePipe.transform('MAP.FEAT_DETECTIONS', {x:(result as DetectionFeatureDB[]).length}),
                    action: 'ΟΚ',
                    duration: 3000, 
                    hPosition: 'center', 
                    vPosition: 'bottom'
            });
            
            const detections:mapillary.OutlineTag[] = (result as DetectionFeatureDB[])
            .flatMap((df, i) => {
                const geometries: DetectionGeometry[] = JSON.parse(df.geometry.replace(/'/g, '"'));
                return geometries.map( (gm, j) => {
                    const coordinates = gm.coordinates;
                    coordinates.push(coordinates[0]);
                    const tagGeometry: mapillary.PolygonGeometry = new mapillary.PolygonGeometry(coordinates);
                    const objOptions: mapillary.OutlineTagOptions = {
                        domain: mapillary.TagDomain.TwoDimensional,
                        fillColor: 0x0000ff,
                        fillOpacity: 0.5,
                        lineColor: 0xff0000,
                        lineWidth: 5,
                        text: df.value,
                        textColor: 0xffffff,
                    };
                    const detection = new mapillary.OutlineTag('clicked-tag-' + i + j + '--' + df.value, tagGeometry, objOptions);
                    return detection;
                });
             }
            );
            this.tagComponent.activate();
            this.tagComponent.add(detections);
      });
    }
}
