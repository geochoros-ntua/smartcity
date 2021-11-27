import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import { MapService } from './Services/map.service';
import { SmartCityMapConfig } from './api/map.interfaces';
import { MapBrowserEvent } from 'ol';
import { MapLayersService } from './Services/map.layers.service';
import { MapMapillaryService } from './Services/map.mapillary.service';


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
    private mapLayersService: MapLayersService,
    private mapMapillaryService: MapMapillaryService) {

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
        this.mapLayersService.SelectionLayer
      ]
    };
    this.mapService.initMap(this.mapConfig);
    this.map = this.mapService.currentMap;
    this.registerMapEvents();
    
  }

  private registerMapEvents(): void {
    const this_ = this;
    // click on map events
    this.map.on('click', (event: MapBrowserEvent<any>) => {
      this.mapService.showNotificationMessage("oopss this is a map click");
      this.mapService.onMapClicked(event);
    });
    // pointer on feature hover
    this.map.on('pointermove', (event: MapBrowserEvent<any>) => {
      const pixel = this_.map.getEventPixel(event.originalEvent);
      const hit = this_.map.hasFeatureAtPixel(pixel);
      this_.map.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }

  
}
