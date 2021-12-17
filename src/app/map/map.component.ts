import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import { MapLayersService } from './Services/map.layers.service';
import { MapService } from './Services/map.service';
import { SmartCityMapConfig } from './api/map.interfaces';
import { MapBrowserEvent } from 'ol';

import { MapMapillaryService } from './Services/map.mapillary.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})



export class MapComponent implements OnInit {

  private mapConfig: SmartCityMapConfig;

  constructor(
    private mapService: MapService,
    private mapLayersService: MapLayersService) {

  }

  ngOnInit(): void {
    this.mapLayersService.initLayers();
    this.mapConfig = {
      mapDivId: 'map_div',
      mapillaryDivId: 'mapillaryDiv',
      zoomLevel: 15,
      center: [23.7114, 37.9827],
      layers: [
        this.mapLayersService.cartoDarkLayer,
        this.mapLayersService.GosmLayer,
        this.mapLayersService.OsmLayer,
        this.mapLayersService.MlSequencesLayer,
        this.mapLayersService.MlImagesLayer,
        this.mapLayersService.MlPointsLayer,
        this.mapLayersService.SelectionLayer
      ]
    };
    this.mapService.initMap(this.mapConfig);
    this.registerMapEvents();
  }

  private registerMapEvents(): void {
    const thisP = this;
    // once first map render
    this.mapService.smartCityMap.once('rendercomplete', (evt) => {
      thisP.mapService.smartCityMap.updateSize();
    });

    // click on map event
    this.mapService.smartCityMap.on('click', (event: MapBrowserEvent<any>) => {
      this.mapService.showNotificationMessage('oopss this is a map click');
      this.mapService.onMapClicked(event);
    });

    // pointer on feature hover
    this.mapService.smartCityMap.on('pointermove', (event: MapBrowserEvent<any>) => {
      const pixel = thisP.mapService.smartCityMap.getEventPixel(event.originalEvent);
      const hit = thisP.mapService.smartCityMap.hasFeatureAtPixel(pixel);
      thisP.mapService.smartCityMap.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }
}
