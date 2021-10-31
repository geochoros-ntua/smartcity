import { Injectable } from "@angular/core";
import * as mapillary from 'mapillary-js';

@Injectable({
    providedIn: 'root'
  })
  export class MapMapillaryService {

    private MPL_KEY = 'MLY|4195156090570097|6a0d147f286068b5fc9a83bb734dc467';


    constructor( ) {}


    public initMapillaryViewer(imageId, mapillaryDivId): mapillary.Viewer {
        const options: mapillary.ViewerOptions = {
            accessToken: this.MPL_KEY,
            component: { cover: false }, 
            container: mapillaryDivId,
            cameraControls: mapillary.CameraControls.Street,
            imageId: imageId +''
          };
          
          return new mapillary.Viewer(options);
    
    }


  }