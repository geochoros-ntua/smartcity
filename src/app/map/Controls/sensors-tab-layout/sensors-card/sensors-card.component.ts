import { Component, Input, OnInit } from '@angular/core';
import { CameraControls, TransitionMode, Viewer } from 'mapillary-js';
import MapUtils from 'src/app/map/map.helper';
import { MapMapillaryService } from 'src/app/map/Services/map.mapillary.service';
import { SensorsService } from 'src/app/map/Services/map.sensors.service';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';

@Component({
  selector: 'app-sensors-card',
  templateUrl: './sensors-card.component.html',
  styleUrls: ['./sensors-card.component.scss']
})
export class SensorsCardComponent implements OnInit {

  
  @Input()
  title: string;

  @Input()
  imageid: string;
  private mplViewer: Viewer;
  
  constructor(private mapMapillaryService: MapMapillaryService, public sensorsService: SensorsService, 
    public darkThemeService: DarkThemeService, public translateService: TranslateService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.initMapillarySensorViewer(this.imageid);
  }

  ngOnDestroy(){
    this.mplViewer.remove(); 
  }

  public dateRepresentation(date: Date): string {
    return MapUtils.formatDateTime(
      date, 
      this.translateService.getLang() === 'en' ? 'en-US' : 'el-GR'
      );
  }



  public getSumInside(liveReport: any): string {
    return liveReport.map((rp: any) => rp.inside).reduce((a: number, b: number) => a + b);
  }

  public initMapillarySensorViewer(imageId: string): void{
    const componentOptions = {
      bearing: true,
      cache: true,
      cover: false,
      popup: true,
      direction: true,
      keyboard: {keyZoom: true},
      pointer: {scrollZoom: true},
      sequence: false,
      zoom: true,
    };
    const viewerOptions = {
      accessToken: this.mapMapillaryService.MPL_KEY,
      cameraControls: CameraControls.Street,
      combinedPanning: false,
      component: componentOptions,
      container: 'sensorMapillaryDivId',
      imageId,
      imageTiling: true,
      trackResize: true,
      transitionMode: TransitionMode.Instantaneous,
    };
  
    this.mplViewer = new Viewer(viewerOptions);
  }


}
