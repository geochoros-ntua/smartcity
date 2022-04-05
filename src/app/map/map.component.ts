import { MapLayersService } from './Services/map.layers.service';
import { DarkThemeService } from './../shared/dark-theme/dark-theme.service';
import { Component, OnInit } from '@angular/core';
import { MapService } from './Services/map.service';
import { MapBrowserEvent } from 'ol';
import { MapMode } from './api/map.enums';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit {


  constructor(
    private mapService: MapService, 
    private mapLayersService: MapLayersService, 
    private darkThemeService: DarkThemeService) {

  }

  ngOnInit(): void {
    this.mapService.initMap();
    this.registerMapEvents(this);
    const isDarkTheme = this.darkThemeService.darkTheme;
    this.mapLayersService.cartoDarkLayer.setVisible(isDarkTheme);
    this.mapLayersService.cartoLightLayer.setVisible(!isDarkTheme);
  }

  public isStreetMode(): boolean {
    return this.mapService.mapMode === MapMode.street;
  }

  public isStatsMode(): boolean {
    return this.mapService.mapMode === MapMode.stats_i || this.mapService.mapMode === MapMode.stats_q;
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
