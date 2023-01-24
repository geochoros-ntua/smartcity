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
  isStreet: boolean; 
  isStats: boolean; 

  constructor(
    private mapService: MapService, 
    public mapLayersService: MapLayersService) {

  }

  ngOnInit(): void {
    this.mapService.initMap();
    this.registerMapEvents(this);
    this.resetMapType(this.mapService.mapMode);
    this.mapService.mapMode$.subscribe( mode =>{
      this.resetMapType(mode);
    })
    
  }

  private resetMapType(mode:MapMode): void{
    this.isStreet = (mode === MapMode.street);
    this.isStats = (mode === MapMode.stats_i || mode === MapMode.stats_q);
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
