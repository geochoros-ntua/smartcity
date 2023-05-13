import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapStatsDataModalComponent } from '../map-stats-data-modal/map-stats-data-modal.component';

@Component({
  selector: 'app-map-stats-data',
  templateUrl: './map-stats-data.component.html',
  styleUrls: ['./map-stats-data.component.scss']
})
export class MapStatsDataComponent {


  constructor(public dialog: MatDialog) { 
    
  }

  public openStatsDialog(): void {
    this.dialog.open(MapStatsDataModalComponent,{
      position: {
        top: '10.0em',
        right: '5.5em',
      }});
  }
}
