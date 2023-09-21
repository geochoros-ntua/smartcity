import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapShareModalComponent } from '../map-share-modal/map-share-modal.component';

@Component({
  selector: 'app-map-share',
  templateUrl: './map-share.component.html',
  styleUrls: ['./map-share.component.scss']
})
export class MapShareComponent implements OnInit {

  constructor(public dialog: MatDialog, ) { }

  ngOnInit(): void {
  }

  public openShareDialog(): void{
    this.dialog.open(MapShareModalComponent,{
      panelClass: 'map_share_dialog',
    });
  }

}
