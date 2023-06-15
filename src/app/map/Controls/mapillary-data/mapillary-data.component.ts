import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapillaryDataModalComponent } from '../mapillary-data-modal/mapillary-data-modal.component';
import { MapMapillaryService } from '../../Services/map.mapillary.service';

@Component({
  selector: 'app-mapillary-data',
  templateUrl: './mapillary-data.component.html',
  styleUrls: ['./mapillary-data.component.scss']
})
export class MapillaryDataComponent {

  constructor(public dialog: MatDialog, private mapMapillaryService: MapMapillaryService) { 
    
  }

  public openDialog(): void {
    this.mapMapillaryService.mplDataDialogRef = this.dialog.open(MapillaryDataModalComponent,{
      hasBackdrop: false,
      disableClose : true,
      position: {
        top: '10.0em',
        right: '5.5em',
        
      }});
  }


}
