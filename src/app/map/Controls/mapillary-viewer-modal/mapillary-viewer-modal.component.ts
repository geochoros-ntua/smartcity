import { ChangeDetectorRef, Component } from '@angular/core';
import { MapMapillaryService } from '../../Services/map.mapillary.service';


@Component({
  selector: 'app-mapillary-viewer-modal',
  templateUrl: './mapillary-viewer-modal.component.html',
  styleUrls: ['./mapillary-viewer-modal.component.scss']
})

export class MapillaryViewerModalComponent {
  

  constructor( public mapMapillaryService: MapMapillaryService, private ref: ChangeDetectorRef) { 

  }


  public toggleFullScreen():void {
    if (this.mapMapillaryService.mplPopupClass === 'mapillaryViewer'){
      this.mapMapillaryService.mplPopupClass = 'mapillaryViewer-full';
    } else {
      this.mapMapillaryService.mplPopupClass = 'mapillaryViewer';
    }
    this.ref.detectChanges();
    this.mapMapillaryService.removeDetection = false;
    this.mapMapillaryService.mapillaryViewer.getCenter().then(center => {
    this.mapMapillaryService.showMapillaryViewer(
        {...this.mapMapillaryService.mplConfig, 
          detection: this.mapMapillaryService.tagComponent.getAll().length>0 ? this.mapMapillaryService.mplConfig.detection : undefined, 
          imageId: this.mapMapillaryService.selFeature.get('id'),
          imageCenter: center
        }
      );
    });
  }

}
