import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import {defaults as defaultControls} from 'ol/control';
import * as olProj from 'ol/proj';
import Feature from 'ol/Feature';
import { MapLayersService } from './map.layers.service';
import { MatDialog } from '@angular/material/dialog';
import * as mapillary from 'mapillary-js';
import { MapMapillaryService } from './map.mapillary.service';
import { MapillaryPopupComponent } from '../Controls/mapillary-popup/mapillary-popup.component';
import Point from 'ol/geom/Point';
import Geometry from 'ol/geom/Geometry';
import { SmartCityMapConfig } from '../api/map.interfaces';

const enum MapillaryLayerNames {
  seq = 'mpl_sequences',
  img = 'mpl_images',
  point = 'mpl_points'
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map:Map;
  private viewer: mapillary.Viewer;
  private smartCityMapConfig: SmartCityMapConfig

  constructor( private mapLayersService:MapLayersService , private mapMapillaryService: MapMapillaryService, private dialog: MatDialog) {}

  public initMap(smartCityMapConfig: SmartCityMapConfig): void {
    this.smartCityMapConfig = smartCityMapConfig;
    this.mapLayersService.initLayers();
      this.map = new Map({
        target: smartCityMapConfig.mapDivId,
        layers: [
          this.mapLayersService.getCartoDarkLayer(), 
          this.mapLayersService.getOSMLayer(), 
          this.mapLayersService.getGOSMLayer(), 
          this.mapLayersService.getMlSequencesLayer(),
          this.mapLayersService.getMlImagesLayer(),
          this.mapLayersService.getSelectionLayer()
        ],
        controls: defaultControls({zoom:false,attribution : false}),
        view: new View({
          center: olProj.transform(smartCityMapConfig.center, 'EPSG:4326', 'EPSG:3857'),
          projection: 'EPSG:3857',
          zoom: smartCityMapConfig.zoomLevel
        })
      });
      this.registerMapEvents();
    }

  public getCurrentMap(): Map{
    return this.map;
  }

  private registerMapEvents(): void{
    this.map.on('click', (event) => {
      this.map.forEachFeatureAtPixel(event.pixel, (feature: Feature<Geometry>) => {
        console.log('feature',feature)
        this.closeDialog();
        this.openDialog(feature);
      }, {
        hitTolerance: 1
      });
    });

    this.dialog._afterAllClosed.subscribe( _ => {
      console.log('closed do something .....');
      this.viewer.remove();
      this.mapLayersService.getSelectionLayer().getSource().clear();
    })
  }


  private registerMplViewerEvents(): void{
    this.viewer.on('image', async (event) => {  
        console.log('event.image.id',event.image.id)
        this.map.getView().setCenter(olProj.transform([event.image.lngLat.lng, event.image.lngLat.lat], 'EPSG:4326', 'EPSG:3857'));
        const selFeature = new Feature({
            name: 'selected',
            id: event.image.id,
            compass_angle : event.image.compassAngle,
            geometry: new Point(olProj.transform([event.image.lngLat.lng, event.image.lngLat.lat], 'EPSG:4326', 'EPSG:3857'))
        });
        this.mapLayersService.getSelectionLayer().getSource().clear();
        this.mapLayersService.getSelectionLayer().getSource().addFeature(selFeature);
      });
  }


  private openDialog(feature: Feature<Geometry>): void {
    this.dialog.open(MapillaryPopupComponent, {
      position: {
        top: '0.5em',
        left: '0.5em',
      }}).afterOpened().subscribe( _ => {
      if (feature.get('layer')){
      switch(feature.get('layer')) { 
          case MapillaryLayerNames.seq: { 
            this.viewer = this.mapMapillaryService.initMapillaryViewer(
              feature.get('image_id'), 
              this.smartCityMapConfig.mapillaryDivId
            );
            this.registerMplViewerEvents();
            break; 
          } 
          case MapillaryLayerNames.img: { 
            this.viewer = this.mapMapillaryService.initMapillaryViewer(
              feature.get('id'), 
              this.smartCityMapConfig.mapillaryDivId
            );
            this.registerMplViewerEvents();
            break; 
          } 
          case MapillaryLayerNames.point: { 
            //@TODO to be implemented
            this.viewer = this.mapMapillaryService.initMapillaryViewer(
              feature.get('id'), 
              this.smartCityMapConfig.mapillaryDivId
            );
            this.registerMplViewerEvents();
            break; 
          } 
          default: { 
            console.error("No such layer")
            break; 
          } 
        } 
      }
      
    });
    
  }

  private closeDialog(): void {
    this.viewer?.remove();
    this.dialog.closeAll();
  }

}