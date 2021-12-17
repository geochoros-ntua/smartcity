import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import * as olProj from 'ol/proj';
import { SmartCityMapillaryConfig, SmartCityMapConfig } from '../api/map.interfaces';
import Notification from 'ol-ext/control/Notification';
import { MapMapillaryService } from './map.mapillary.service';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MapBrowserEvent } from 'ol';
import { MapillaryLayerNames } from '../api/map.enums';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: Map;
  private notification: Notification;
  private smartCityMapConfig: SmartCityMapConfig;

  constructor(private mapMapillaryService: MapMapillaryService) { }

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
  }

  public get smartCityMap(): Map {
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
      if (feature.get('layer')) {
        console.log('feature', feature)
        switch (feature.get('layer')) {
          case MapillaryLayerNames.seq: {
            const mapillaryViewerConfig: SmartCityMapillaryConfig = {
              imageId: feature.get('image_id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map: this.smartCityMap
            };
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          case MapillaryLayerNames.img: {
            const mapillaryViewerConfig: SmartCityMapillaryConfig = {
              imageId: feature.get('id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map: this.smartCityMap
            };
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          case MapillaryLayerNames.point: {
            const mapillaryViewerConfig: SmartCityMapillaryConfig = {
              imageId: null,
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map: this.smartCityMap
            };
            this.mapMapillaryService.showFeatureOnImage(mapillaryViewerConfig, feature);
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
