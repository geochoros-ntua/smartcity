import { ChangeDetectorRef, Component } from '@angular/core';
import { PolygonGeometry } from 'mapillary-js';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { DetectionFeature } from '../../api/map.api';
import { MapMapillaryService } from '../../Services/map.mapillary.service';


@Component({
  selector: 'app-mapillary-viewer-modal',
  templateUrl: './mapillary-viewer-modal.component.html',
  styleUrls: ['./mapillary-viewer-modal.component.scss']
})

export class MapillaryViewerModalComponent {

  

  constructor( 
    public mapMapillaryService: MapMapillaryService, 
    public darkThemeService: DarkThemeService) { 

  }


  public toggleFullScreen():void {
    if (this.mapMapillaryService.mplPopupClass === 'mapillaryViewer'){
      this.mapMapillaryService.mplPopupClass = 'mapillaryViewer-full';
    } else {
      this.mapMapillaryService.mplPopupClass = 'mapillaryViewer';
    }

    this.mapMapillaryService.removeDetection = false;
    this.mapMapillaryService.mapillaryViewer.getCenter().then(center => {
      const detections: DetectionFeature[] = this.mapMapillaryService.tagComponent
      .getAll()
      .map(tag => {
        return {
          image_id: this.mapMapillaryService.selFeature.get('id'),
          feature_id: this.mapMapillaryService.selFeature.get('feature_id'),
          value:tag.id,
          extentArea: 0,
          geometries: [{
            type: 'POLYGON',
            coordinates: (tag.geometry as PolygonGeometry).polygon
          }]
        };
    });

 
    this.mapMapillaryService.showMapillaryViewer(
        {...this.mapMapillaryService.mplConfig, 
          detections: this.mapMapillaryService.tagComponent.getAll().length>0 ? detections : undefined, 
          imageId: this.mapMapillaryService.selFeature.get('id'),
          imageCenter: center
        }
      );
    });
  }


  

}
