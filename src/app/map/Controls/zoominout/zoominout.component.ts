import { Component, OnInit } from '@angular/core';
import { MapService } from '../../Services/map.service';

@Component({
  selector: 'app-zoominout',
  templateUrl: './zoominout.component.html',
  styleUrls: ['./zoominout.component.scss']
})
export class ZoominoutComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
  }

  zoomIn():void{
    this.mapService.smartCityMap.getView().animate({
      center: this.mapService.smartCityMap.getView().getCenter(),
      zoom:   this.mapService.smartCityMap.getView().getZoom()! + 1
    });
  }
  zoomOut():void{
    this.mapService.smartCityMap.getView().animate({
      center: this.mapService.smartCityMap.getView().getCenter(),
      zoom:   this.mapService.smartCityMap.getView().getZoom()! - 1
    });
  }

}
