import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapStatsDataModalComponent } from '../map-stats-data-modal/map-stats-data-modal.component';
import { StatsService } from '../../Services/map.stats.service';

@Component({
  selector: 'app-map-stats-data',
  templateUrl: './map-stats-data.component.html',
  styleUrls: ['./map-stats-data.component.scss']
})
export class MapStatsDataComponent {
  // private dialogRef: MatDialogRef<MapStatsDataModalComponent, any>;

  constructor(public mapStatsService: StatsService,public dialog: MatDialog) { 
    
  }

  public openStatsDialog(): void {
    this.mapStatsService.statDialogRef?.close();
    this.mapStatsService.statDialogRef = this.dialog.open(MapStatsDataModalComponent,{
      maxWidth: '80vw',
      width: '25%',
      hasBackdrop: false,
      disableClose : true,
    });
  }
}
