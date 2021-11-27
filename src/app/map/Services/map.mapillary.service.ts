import { Injectable } from '@angular/core';
import * as mapillary from 'mapillary-js';
import FixedPopup from 'ol-ext/overlay/FixedPopup';
import * as olProj from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import { MapLayersService } from './map.layers.service';
import { MapillaryViewerConfig } from '../api/map.interfaces';

@Injectable({
    providedIn: 'root'
})
export class MapMapillaryService {

    private MPL_KEY: string = 'MLY|4195156090570097|6a0d147f286068b5fc9a83bb734dc467';
    private viewer: mapillary.Viewer;
    private _mapillaryPopup: FixedPopup;


    constructor(private mapLayersService: MapLayersService) { }

    public get mapillaryViewer(): mapillary.Viewer {
        return this.viewer;
    }

    public get mapillaryPopup(): FixedPopup{
        return this._mapillaryPopup;
    }

    public initMapillaryViewer(imageId: string, mapillaryDivId: string): void {
        const options: mapillary.ViewerOptions = {
            accessToken: this.MPL_KEY,
            component: { cover: false },
            container: mapillaryDivId,
            cameraControls: mapillary.CameraControls.Street,
            imageId: imageId + ''
        };
        this.viewer = new mapillary.Viewer(options);
    }

    public initMapillaryPopup(map: Map){
        this._mapillaryPopup = new FixedPopup ({
            popupClass: "black", //"tooltips", "warning" "black" "default", "tips", "shadow",
            anim: true,
            closeBox: true
        });

        map.addOverlay(this.mapillaryPopup);

        this._mapillaryPopup.onclose = (event) => {
            this.mapillaryViewer?.remove();
            this.mapLayersService.SelectionLayer.getSource().clear();
        }
    }

    public setMapillaryPopUp(feature: Feature<any>){
        this.mapillaryPopup.show(
          feature.getGeometry().getFirstCoordinate(),
        '<div style="width: 640px; height: 400px;" id="mapillaryDiv"></div>'
        ); 
    }



    public showMapillaryViewer(mapillaryViewerConfig: MapillaryViewerConfig): void {
        this.initMapillaryViewer(
            mapillaryViewerConfig.imageId,
            mapillaryViewerConfig.mapillaryDivId
        );
        this.registerMplViewerEvents(mapillaryViewerConfig.map);
    }

    private registerMplViewerEvents(map: Map): void {
        this.mapillaryViewer.on('image', async (event: mapillary.ViewerImageEvent) => {
            const coord = olProj.transform([event.image.lngLat.lng, event.image.lngLat.lat], 'EPSG:4326', 'EPSG:3857')
            map.getView().setCenter(coord);
            const selFeature = new Feature({
                name: 'selected',
                id: event.image.id,
                compass_angle: event.image.compassAngle,
                geometry: new Point(coord)
            });
            this.mapillaryPopup.setPosition(coord);
            this.mapLayersService.SelectionLayer.getSource().clear();
            this.mapLayersService.SelectionLayer.getSource().addFeature(selFeature);

        });
    }

    public removeMapillaryViewer() {
        this.mapillaryViewer?.remove();
        this.mapLayersService.SelectionLayer.getSource().clear();
    }
}
