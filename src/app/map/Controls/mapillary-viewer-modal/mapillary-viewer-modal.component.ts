import { ChangeDetectorRef, Component } from '@angular/core';
import { CameraControls } from 'mapillary-js';
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
      this.mapMapillaryService.mplPopupClass = 'mapillaryViewer-full'
    } else {
      this.mapMapillaryService.mplPopupClass = 'mapillaryViewer'
    }
    this.ref.detectChanges();
    this.mapMapillaryService.removeDetection = false;
    // console.log('image id',this.mapMapillaryService.selFeature.get('id'))
    console.log('bearing:',this.mapMapillaryService.mapillaryViewer.getCenter());
    // console.log(this.mapMapillaryService.tagComponent.getAll().length);
    // console.log(this.mapMapillaryService.mplConfig.detection);
    this.mapMapillaryService.mapillaryViewer.getCenter().then(center => {
    this.mapMapillaryService.showMapillaryViewer(
        {...this.mapMapillaryService.mplConfig, 
          detection: this.mapMapillaryService.tagComponent.getAll().length>0 ? this.mapMapillaryService.mplConfig.detection : undefined, 
          imageId: this.mapMapillaryService.selFeature.get('id'),
          center
        }
      );
    });
  }

}
