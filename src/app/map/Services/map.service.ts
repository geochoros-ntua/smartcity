import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import * as olProj from 'ol/proj';
import { MapLayersService } from './map.layers.service';
import { MapillaryLayerNames, MapillaryViewerConfig, SmartCityMapConfig } from '../api/map.interfaces';
import Notification from 'ol-ext/control/Notification';
import { MapMapillaryService } from './map.mapillary.service';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MapBrowserEvent } from 'ol';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: Map;
  private notification: Notification;
  private smartCityMapConfig: SmartCityMapConfig;
  

  constructor(private mapLayersService: MapLayersService, private mapMapillaryService: MapMapillaryService) { }

  public initMap(smartCityMapConfig: SmartCityMapConfig): void {
    this.smartCityMapConfig = smartCityMapConfig;
    this.map = new Map({
      target: smartCityMapConfig.mapDivId,
      layers: smartCityMapConfig.layers,
      controls: defaultControls({ zoom: false, attribution: false }).extend([]),
      view: new View({
        center: olProj.transform(smartCityMapConfig.center, 'EPSG:4326', 'EPSG:3857'),
        projection: 'EPSG:3857',
        zoom: smartCityMapConfig.zoomLevel
      })
    });
    // add any custom map controls
    this.addNotificationControl();

    // add the mapillary popup overlay
    this.mapMapillaryService.initMapillaryPopup(this.map);

  }

  public get currentMap(): Map {
    return this.map;
  }


  public showNotificationMessage(msg: string): void{
    this.notification.show(msg);
  }

  private addNotificationControl(): void{
    this.notification = new Notification();
    this.map.addControl(this.notification);
  }


  public onMapClicked(event: MapBrowserEvent<any>): void {
    this.map.forEachFeatureAtPixel(event.pixel, (feature: Feature<Geometry>) => {
      console.log('feature',feature)
      if (feature.get('layer')) {
        console.log(feature.get('layer'))

        this.mapMapillaryService.removeMapillaryViewer();
        this.mapMapillaryService.setMapillaryPopUp(feature);
        switch (feature.get('layer')) {
          case MapillaryLayerNames.seq: {
            const mapillaryViewerConfig: MapillaryViewerConfig = {
              imageId:feature.get('image_id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map:this.currentMap
            }
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          case MapillaryLayerNames.img: {
            const mapillaryViewerConfig: MapillaryViewerConfig = {
              imageId:feature.get('id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map:this.currentMap
            }
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          case MapillaryLayerNames.point: {
            // @TODO to be implemented
            const mapillaryViewerConfig: MapillaryViewerConfig = {
              imageId:feature.get('id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map:this.currentMap
            }
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          default: {
            console.error('No such layer');
            break;
          }
        }
      }
      // breaking the iteration. get the first feature found. Forget the rest
      return true;
    }, {
      hitTolerance: 1
    });
  }



}
