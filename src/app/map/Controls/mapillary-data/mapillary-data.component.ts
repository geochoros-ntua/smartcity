import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapillaryDataModalComponent } from '../mapillary-data-modal/mapillary-data-modal.component';

@Component({
  selector: 'app-mapillary-data',
  templateUrl: './mapillary-data.component.html',
  styleUrls: ['./mapillary-data.component.scss']
})
export class MapillaryDataComponent {

  constructor(public dialog: MatDialog) { 
    
  }

  public openDialog(): void {
    this.dialog.open(MapillaryDataModalComponent);
  }


}
