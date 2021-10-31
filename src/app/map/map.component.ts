import { Component, OnInit } from '@angular/core';
import { MapService } from './Services/map.service';
import { SmartCityMapConfig } from './api/map.interfaces';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

 


export class MapComponent implements OnInit {

  constructor(private mapService: MapService) { 
  
  }

  ngOnInit(): void {
    const mapConfig: SmartCityMapConfig = {
      mapDivId:'map_div', 
      mapillaryDivId:'mapillaryDiv',
      zoomLevel: 15, 
      center : [23.7114,37.9827]
    }
    this.mapService.initMap(mapConfig);
  }

}
