import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MapService } from '../../Services/map.service';
import { MapMode } from '../../api/map.enums';
import { StatsService } from '../../Services/map.stats.service';

@Component({
  selector: 'app-map-share-modal',
  templateUrl: './map-share-modal.component.html',
  styleUrls: ['./map-share-modal.component.scss']
})
export class MapShareModalComponent implements OnInit {
  public currentZoomLevel:number;
  public currentCenter: number[];
  public currentMode: MapMode;
  public currentIndex:string;

  constructor(private clipboard: Clipboard, private mapService: MapService, public mapStatService: StatsService) { }

  ngOnInit(): void {
    this.currentZoomLevel = this.mapService.smartCityMap.getView().getZoom();
    this.currentCenter = this.mapService.smartCityMap.getView().getCenter();
    this.currentMode = this.mapService.mapMode;
    this.currentIndex = this.mapStatService.selectedStatsIndex.code;
  }


  public copyInputMessage(message: HTMLInputElement){
    this.clipboard.copy(message.value);
  }

}
