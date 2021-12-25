import { Component, OnInit } from '@angular/core';
import { MapLayersService } from './Services/map.layers.service';
import { MapService } from './Services/map.service';
import { SmartCityMapConfig } from './api/map.interfaces';
import { MapBrowserEvent } from 'ol';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})



export class MapComponent implements OnInit {

  private mapConfig!: SmartCityMapConfig;

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
    this.registerMapEvents(this);
  }

  private registerMapEvents(thisP: MapComponent): void {
    
    // once first map render
    this.mapService.smartCityMap.once('rendercomplete', () => {
      thisP.mapService.smartCityMap.updateSize();
    });

    // click on map event
    this.mapService.smartCityMap.on('click', (event: MapBrowserEvent<UIEvent>) => {
      this.mapService.onMapClicked(event);
    });

    // pointer on feature hover
    this.mapService.smartCityMap.on('pointermove', (event: MapBrowserEvent<UIEvent>) => {
      const pixel = thisP.mapService.smartCityMap.getEventPixel(event.originalEvent);
      const hit = thisP.mapService.smartCityMap.hasFeatureAtPixel(pixel);
      thisP.mapService.smartCityMap.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }
}
