import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import {defaults as defaultControls} from 'ol/control';
import * as olProj from 'ol/proj';
import { MapLayersService } from './map.layers.service';
import { SmartCityMapConfig } from '../api/map.interfaces';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map:Map;

  constructor( private mapLayersService:MapLayersService) {}

  public initMap(smartCityMapConfig: SmartCityMapConfig): void {
    this.mapLayersService.initLayers();
      this.map = new Map({
        target: smartCityMapConfig.mapDivId,
        layers: [
          this.mapLayersService.cartoDarkLayer, 
          this.mapLayersService.GosmLayer, 
          this.mapLayersService.OsmLayer, 
          this.mapLayersService.MlSequencesLayer,
          this.mapLayersService.MlImagesLayer,
          this.mapLayersService.SelectionLayer
        ],
        controls: defaultControls({zoom:false,attribution : false}),
        view: new View({
          center: olProj.transform(smartCityMapConfig.center, 'EPSG:4326', 'EPSG:3857'),
          projection: 'EPSG:3857',
          zoom: smartCityMapConfig.zoomLevel
        })
      });
    }

  public get currentMap(): Map{
    return this.map;
  }

 

}