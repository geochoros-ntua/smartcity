import { Component, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MapMode } from '../../api/map.enums';
import { MapService } from '../../Services/map.service';

@Component({
  selector: 'app-map-stats-mode',
  templateUrl: './map-stats-mode.component.html',
  styleUrls: ['./map-stats-mode.component.scss']
})
export class MapStatsModeComponent {

  @ViewChild('subModeTooltip')
  subModeTooltip!: MatTooltip;

  constructor(private  mapService: MapService) { }


  public get isFactor(): boolean{
    return this.mapService.subFactorsMode === MapMode.stats_i;
  }

  public setSubMode(showFactors: boolean): void{
    if (showFactors){
      this.mapService.mapMode$.next(MapMode.stats_i);
      this.subModeTooltip.show();
    } else {
      this.mapService.mapMode$.next(MapMode.stats_q);
      this.subModeTooltip.show();
    }
  }

  public getToolTip(): string {
    return this.isFactor ? 'Αντικειμενικοί δείκτες' : 'Υποκειμενικοί δείκτες';
  }

}
