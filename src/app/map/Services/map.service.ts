import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import * as olProj from 'ol/proj';
import { SmartCityMapillaryConfig, SmartCityMapConfig, FeatureClickedWithPos } from '../api/map.interfaces';
import { MapMapillaryService } from './map.mapillary.service';
import { MapBrowserEvent } from 'ol';
import { VectorLayerNames, MapMode } from '../api/map.enums';
import { BehaviorSubject, Subject } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import { AppMessagesService } from 'src/app/shared/messages.service';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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

  private smartCityMapConfig: SmartCityMapConfig = {
    mapDivId: 'map_div',
    mapillaryDivId: 'mapillaryDiv',
    zoomLevel: 13,
    center: [23.7314, 37.9827]
  };
  
  constructor(
    private mapMapillaryService: MapMapillaryService, 
    private mapLayersService: MapLayersService, 
    private mapMessagesService: AppMessagesService,
    private service: TranslateService
    ) {
      this.translatePipe = new TranslatePipe(this.service);
    // Subscribe
    // keep the map mode switching central
    // There should be more things to add here, 
    // so it is a good idea to keep it sharable
    this.mapMode$.subscribe((mode: MapMode) => {
      this.mapMode = mode;
      if (this.mapMode === MapMode.stats_i || this.mapMode === MapMode.stats_q ){
        this.subFactorsMode = this.mapMode;``
      }
      this.onModeChangeLayerVisibility(mode);
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


  private onModeChangeLayerVisibility(mode: MapMode): void{
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


    switch(mode) { 
      case MapMode.street: { 
         this.mapLayersService.MlSequencesLayer.setVisible(this.mapLayersService.checkedSeq);
         this.mapLayersService.MlImagesLayer.setVisible(this.mapLayersService.checkedImg);
         this.mapLayersService.MlPointsLayer.setVisible(true);
         this.mapLayersService.FactorsDKLayer.setVisible(false);
         this.mapLayersService.FactorsGeitLayer.setVisible(false);
         this.mapLayersService.FacorsPdstrLayer.setVisible(false);
         this.mapLayersService.QuestDKLayer.setVisible(false);
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
        break; 
      } 
      default: { 
        console.error(`No such mode error: ${ mode }.`);
         break; 
      } 
   } 
  }

}
