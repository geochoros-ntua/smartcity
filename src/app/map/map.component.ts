import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import { MapService } from './Services/map.service';
import { SmartCityMapConfig } from './api/map.interfaces';
import * as mapillary from 'mapillary-js';
import * as olProj from 'ol/proj';
import { MatDialog } from '@angular/material/dialog';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { MapLayersService } from './Services/map.layers.service';
import { MapillaryPopupComponent } from './Controls/mapillary-popup/mapillary-popup.component';
import Point from 'ol/geom/Point';
import { MapMapillaryService } from './Services/map.mapillary.service';


const enum MapillaryLayerNames {
  seq = 'mpl_sequences',
  img = 'mpl_images',
  point = 'mpl_points'
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  private map: Map;
  private mapConfig: SmartCityMapConfig;

  constructor(
    private mapService: MapService, 
    private mapLayersService:MapLayersService, 
    private mapMapillaryService: MapMapillaryService, 
    private dialog: MatDialog) { 
  
  }

  ngOnInit(): void {
    this.mapConfig = {
      mapDivId:'map_div', 
      mapillaryDivId:'mapillaryDiv',
      zoomLevel: 15, 
      center : [23.7114,37.9827]
    }
    this.mapService.initMap(this.mapConfig);
    this.map = this.mapService.currentMap;
    this.registerMapEvents();
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
      this.mapMapillaryService.mapillaryViewer.remove();
      this.mapLayersService.SelectionLayer.getSource().clear();
    })
  }


  private registerMplViewerEvents(): void{
    this.mapMapillaryService.mapillaryViewer.on('image', async (event) => {  
        console.log('event.image.id',event.image.id)
        this.map.getView().setCenter(olProj.transform([event.image.lngLat.lng, event.image.lngLat.lat], 'EPSG:4326', 'EPSG:3857'));
        const selFeature = new Feature({
            name: 'selected',
            id: event.image.id,
            compass_angle : event.image.compassAngle,
            geometry: new Point(olProj.transform([event.image.lngLat.lng, event.image.lngLat.lat], 'EPSG:4326', 'EPSG:3857'))
        });
        this.mapLayersService.SelectionLayer.getSource().clear();
        this.mapLayersService.SelectionLayer.getSource().addFeature(selFeature);
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
            this.mapMapillaryService.initMapillaryViewer(
              feature.get('image_id'), 
              this.mapConfig.mapillaryDivId
            );
            this.registerMplViewerEvents();
            break; 
          } 
          case MapillaryLayerNames.img: { 
            this.mapMapillaryService.initMapillaryViewer(
              feature.get('id'), 
              this.mapConfig.mapillaryDivId
            );
            this.registerMplViewerEvents();
            break; 
          } 
          case MapillaryLayerNames.point: { 
            //@TODO to be implemented
            this.mapMapillaryService.initMapillaryViewer(
              feature.get('id'), 
              this.mapConfig.mapillaryDivId
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
    this.mapMapillaryService.mapillaryViewer?.remove();
    this.dialog.closeAll();
  }

}
