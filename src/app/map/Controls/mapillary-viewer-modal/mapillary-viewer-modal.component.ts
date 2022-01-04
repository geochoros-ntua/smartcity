import { MapLayoutService } from './../../Services/map.layout.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-mapillary-viewer-modal',
  templateUrl: './mapillary-viewer-modal.component.html',
  styleUrls: ['./mapillary-viewer-modal.component.scss']
})

export class MapillaryViewerModalComponent {



  currentView: number = 1;

  constructor(private mapLayoutService:MapLayoutService) {

    this.mapLayoutService.currentView$.subscribe(status=> {
      this.currentView = status;
    })

  }


  toggleStreetViewFullScreen(value: boolean) {

    if (value === true) {
      this.mapLayoutService.announceCurrentView(2);
    }
    else {
      this.mapLayoutService.announceCurrentView(0);
    }
     
  }


}
