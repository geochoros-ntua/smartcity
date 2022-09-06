import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import * as olProj from 'ol/proj';
import { SmartCityMapillaryConfig, SmartCityMapConfig, FeatureClickedWithPos } from '../api/map.api';
import { MapMapillaryService } from './map.mapillary.service';
import { MapBrowserEvent } from 'ol';
import { VectorLayerNames, MapMode } from '../api/map.enums';
import { Subject } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import { AppMessagesService } from 'src/app/shared/messages.service';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';
import { TranslateService } from 'src/app/shared/translate/translate.service';
<<<<<<< HEAD
<<<<<<< HEAD
import { SensorsService } from './map.sensors.service';



=======
import Geometry from 'ol/geom/Geometry';
import { HttpClient, HttpHeaders } from '@angular/common/http';
=======
import { SensorsService } from './map.sensors.service';

>>>>>>> 9d066a6 (imlement sensor graph)


>>>>>>> 8edf21e (implement pedestrian sensors functionality)
/**
 * Author: p.tsagkis
 * Date: 7/2022
 */

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: Map;

  public mapMode$: Subject<MapMode> = new Subject<MapMode>();
  public mapMode: MapMode = MapMode.street;
  public subFactorsMode: MapMode = MapMode.stats_i;
  public featureClickedWithPos$ = new Subject<FeatureClickedWithPos>();
  private translatePipe: TranslatePipe;
  private loadInterMethod: any;

  private smartCityMapConfig: SmartCityMapConfig = {
    mapDivId: 'map_div',
    mapillaryDivId: 'mapillaryDiv',
    zoomLevel: 13,
    center: [23.7314, 37.9827]
  };
  
  constructor(
    private mapMapillaryService: MapMapillaryService, 
    private mapLayersService: MapLayersService, 
    private sensorsService: SensorsService,
    private mapMessagesService: AppMessagesService,
    private translateService: TranslateService
    ) {
      this.translatePipe = new TranslatePipe(this.translateService);
    // Subscribe
    // keep the map mode switching central
    // There should be more things to add here, 
    // so it is a good idea to keep it sharable
    this.mapMode$.subscribe((mode: MapMode) => {
      this.mapMode = mode;
      if (this.mapMode === MapMode.stats_i || this.mapMode === MapMode.stats_q ){
        this.subFactorsMode = this.mapMode;
      } else {
        this.smartCityMap.getOverlayById('popupoverlay')?.setPosition(undefined);
      }
      this.onModeChange(mode);
    });
  }

  public initMap(): void {
    this.mapLayersService.initLayers();
    this.map = new Map({
      target: this.smartCityMapConfig.mapDivId,
      layers: [
        this.mapLayersService.cartoDarkLayer,
        this.mapLayersService.cartoLightLayer,
        this.mapLayersService.GosmLayer,
        this.mapLayersService.OsmLayer,
        this.mapLayersService.KtimaLayer,
        this.mapLayersService.MlSequencesLayer,
        this.mapLayersService.MlImagesLayer,
        this.mapLayersService.MlPointsLayer,
        this.mapLayersService.QuestDKLayer,
        this.mapLayersService.FactorsDKLayer,
        this.mapLayersService.FactorsGeitLayer,
        this.mapLayersService.FacorsPdstrLayer,
        this.mapLayersService.SensorsLayer,
        this.mapLayersService.SelectionLayer
      ],
      controls: defaultControls({ zoom: false, attribution: false }).extend([]),
      view: new View({
        center: olProj.transform(this.smartCityMapConfig.center, 'EPSG:4326', 'EPSG:3857'),
        projection: 'EPSG:3857',
        zoom: this.smartCityMapConfig.zoomLevel
      })
    });

  }

  public get smartCityConfig():SmartCityMapConfig{
    return this.smartCityMapConfig;
  }

  public get smartCityMap(): Map {
    return this.map;
  }

  public onMapClicked(event: MapBrowserEvent<UIEvent>): void {
    this.map.forEachFeatureAtPixel(event.pixel, feature => {
      console.log('feature',feature)
      if (feature.get('layer')) {
        switch (feature.get('layer')) {
          case VectorLayerNames.seq: {
            const mapillaryViewerConfig: SmartCityMapillaryConfig = {
              imageId: feature.get('image_id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map: this.smartCityMap
            };
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          case VectorLayerNames.img: {
            const mapillaryViewerConfig: SmartCityMapillaryConfig = {
              imageId: feature.get('id'),
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map: this.smartCityMap
            };
            this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
            break;
          }
          case VectorLayerNames.point: {
            const mapillaryViewerConfig: SmartCityMapillaryConfig = {
              imageId: '',
              mapillaryDivId: this.smartCityMapConfig.mapillaryDivId,
              map: this.smartCityMap
            };
            this.mapMapillaryService.showFeatureOnImage(mapillaryViewerConfig, feature);
            break;
          }
          case VectorLayerNames.factors_dk: {
            this.smartCityMap.getOverlayById('popupoverlay').setPosition(undefined);
            this.featureClickedWithPos$.next({
              feat:feature,
              coord:event.coordinate
            });
            break;
          }
          case VectorLayerNames.sens: {
<<<<<<< HEAD
            this.sensorsService.showReportGraph(Number(feature.getId()), Number(feature.get('live_report_id')), feature.get('mpl_imageid'));
=======
            this.sensorsService.showReportGraph(feature.getId());
>>>>>>> 9d066a6 (imlement sensor graph)
            break;
          }
          default: {
            console.error('No such layer');
            break;
          }
        }
      }
      // breaking the iteration. get the first feature found. Forget the rest
      return true;
    }, {
      hitTolerance: 1
    });
  }


  private onModeChange(mode: MapMode): void{
    const msg = 
    (mode === 'street') ? this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.MODE-MPLR')}) : 
    (mode === 'sens') ? this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.MODE-SENSORS')}) : 
    (mode === 'stats_q') ? this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.SUBJECTIVE-FACTORS')}) : 
    this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.OBJECTIVE-FACTORS')});

    this.mapMessagesService.showMapMessage({
      message: msg ,
      action: '',
      duration: 3000, 
      hPosition: 'center', 
      vPosition: 'bottom',
      styleClass: 'map-snackbar'
    });
<<<<<<< HEAD
    this.sensorsService.stopReportAutoLoad();
=======

    clearInterval(this.loadInterMethod);
>>>>>>> 8edf21e (implement pedestrian sensors functionality)
    switch(mode) { 
      case MapMode.street: { 
         this.mapLayersService.MlSequencesLayer.setVisible(this.mapLayersService.checkedSeq);
         this.mapLayersService.MlImagesLayer.setVisible(this.mapLayersService.checkedImg);
         this.mapLayersService.MlPointsLayer.setVisible(true);
         this.mapLayersService.FactorsDKLayer.setVisible(false);
         this.mapLayersService.FactorsGeitLayer.setVisible(false);
         this.mapLayersService.FacorsPdstrLayer.setVisible(false);
         this.mapLayersService.QuestDKLayer.setVisible(false);
         this.mapLayersService.SensorsLayer.setVisible(false);
         this.sensorsService.stopReportAutoLoad();
         break; 
      } 
      case MapMode.stats_i: { 
         this.mapLayersService.MlSequencesLayer.setVisible(false);
         this.mapLayersService.MlImagesLayer.setVisible(false);
         this.mapLayersService.MlPointsLayer.setVisible(false);
         this.mapLayersService.FactorsDKLayer.setVisible(true);
         this.mapLayersService.FactorsGeitLayer.setVisible(true);
         this.mapLayersService.FacorsPdstrLayer.setVisible(true);
         this.mapLayersService.QuestDKLayer.setVisible(false);
         this.mapLayersService.SensorsLayer.setVisible(false);
         this.sensorsService.stopReportAutoLoad();
         break; 
      } 
      case MapMode.stats_q: { 
        this.mapLayersService.MlSequencesLayer.setVisible(false);
        this.mapLayersService.MlImagesLayer.setVisible(false);
        this.mapLayersService.MlPointsLayer.setVisible(false);
        this.mapLayersService.FactorsDKLayer.setVisible(false);
        this.mapLayersService.FactorsGeitLayer.setVisible(false);
        this.mapLayersService.FacorsPdstrLayer.setVisible(false);
        this.mapLayersService.QuestDKLayer.setVisible(true);
        this.mapLayersService.SensorsLayer.setVisible(false);
        this.sensorsService.stopReportAutoLoad();
        break; 
     } 
      case MapMode.sens: { 
        this.mapLayersService.MlSequencesLayer.setVisible(false);
        this.mapLayersService.MlImagesLayer.setVisible(false);
        this.mapLayersService.MlPointsLayer.setVisible(false);
        this.mapLayersService.FactorsDKLayer.setVisible(false);
        this.mapLayersService.FactorsGeitLayer.setVisible(false);
        this.mapLayersService.FacorsPdstrLayer.setVisible(false);
        this.mapLayersService.QuestDKLayer.setVisible(false);
        this.mapLayersService.SensorsLayer.setVisible(true);
<<<<<<< HEAD
<<<<<<< HEAD
        this.sensorsService.initSensors();        
=======

        
        this.mapLayersService.SensorsLayer.getSource().once('change', () => {
          console.log("this source", this.mapLayersService.SensorsLayer.getSource())
           this.loadReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures());
        });
        this.loadInterMethod = setInterval(() => {
          this.loadReportForFeats(this.mapLayersService.SensorsLayer.getSource().getFeatures())
        }, 10000);
         
>>>>>>> 8edf21e (implement pedestrian sensors functionality)
=======
        this.sensorsService.initSensors();        
>>>>>>> 9d066a6 (imlement sensor graph)
        break; 
      } 
      default: { 
        console.error(`No such mode error: ${ mode }.`);
        break; 
      } 
   } 
  }


<<<<<<< HEAD
<<<<<<< HEAD
=======
  private loadReportForFeats(feats: Feature<Geometry>[]){
    console.log('feats',feats)
    feats.forEach(feat => {
      console.log('live_report_id', feat.get('live_report_id'));
      let reports: Observable<any>[] = [];
      const reportIds: number[] =  feat.get('live_report_id').split(',');
      reportIds.forEach(rId => {
        reports.push(this.http.get('https://smartcity.fearofcrime.com/php/loadLiveReport.php?report_id='+rId));
      })
      const mergedObservables = combineLatest(reports);
      mergedObservables.subscribe(data => {
        feat.set('value', (Math.abs(data[0][0].inside) + Math.abs(data[1][0].inside)).toString()); 
      });
    })
  }

  private getReport(id:number): Observable<any>{
    return this.http.get('https://smartcity.fearofcrime.com/php/loadLiveReport.php?report_id='+id);
  }
>>>>>>> 8edf21e (implement pedestrian sensors functionality)
=======
>>>>>>> 9d066a6 (imlement sensor graph)
}
