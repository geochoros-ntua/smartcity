import { Component } from '@angular/core';
import { MapMode } from '../../api/map.enums';
import { MapService } from '../../Services/map.service';
import MapUtils from './../../map.helper';

@Component({
  selector: 'app-map-mode',
  templateUrl: './map-mode.component.html',
  styleUrls: ['./map-mode.component.scss']
})
export class MapModeComponent {

  constructor(public mapService: MapService) { }

  public setMapMode(mode: string): void{
    this.mapService.mapMode$.next(MapUtils.getEnumByEnumValue(MapMode, mode));
  }


}
