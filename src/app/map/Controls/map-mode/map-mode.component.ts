import { Component, OnInit } from '@angular/core';
import { MapMode } from '../../api/map.enums';
import { MapService } from '../../Services/map.service';
import MapUtils from './../../map.helper';

@Component({
  selector: 'app-map-mode',
  templateUrl: './map-mode.component.html',
  styleUrls: ['./map-mode.component.scss']
})
export class MapModeComponent implements OnInit{


  constructor(public mapService: MapService) { }

  ngOnInit(): void {
    this.setMapMode(this.mapService.mapMode);
  }

  

  public setMapMode(mode: string): void{
    this.mapService.mapMode$.next(MapUtils.getEnumByEnumValue(MapMode, mode));
  }


}
