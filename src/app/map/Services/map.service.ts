import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import * as olProj from 'ol/proj';
import { SmartCityMapillaryConfig, SmartCityMapConfig, FeatureClickedWithPos } from '../api/map.api';
import { MapMapillaryService } from './map.mapillary.service';
import { MapBrowserEvent, Overlay } from 'ol';
import { VectorLayerNames, MapMode, StatTypes } from '../api/map.enums';
import { Subject } from 'rxjs';
import { MapLayersService } from './map.layers.service';
import { AppMessagesService } from 'src/app/shared/messages.service';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { SensorsService } from './map.sensors.service';

import  { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import {Circle,  Stroke, Style} from 'ol/style';
import {easeOut} from 'ol/easing.js';
import {getVectorContext} from 'ol/render.js';
import {unByKey} from 'ol/Observable.js';
import { StatsService } from './map.stats.service';
import { LineString } from 'ol/geom';
import { getCenter } from 'ol/extent';
import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';

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
  public mapMode: MapMode = MapMode.sens;
  public featureClickedWithPos$: Subject<FeatureClickedWithPos>  = new Subject<FeatureClickedWithPos>();
  private translatePipe: TranslatePipe;
  public flashIntervals: any[] = [];
  public drawInt: Draw;

  private tooltip: HTMLElement;
  private overlay: Overlay;

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
    private mapStatsService: StatsService,
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
      if (this.mapMode !== MapMode.stats ){
        this.smartCityMap.getOverlayById('popupoverlay')?.setPosition(undefined);
      } 
      this.onModeChange(mode);
    });
  }

  public get smartCityConfig(): SmartCityMapConfig{
    return this.smartCityMapConfig;
  }

  public get smartCityMap(): Map {
    return this.map;
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
        this.mapLayersService.MaskLayer,
        this.mapLayersService.MlSequencesLayer,
        this.mapLayersService.MlImagesLayer,
        this.mapLayersService.MlPointsLayer,
        this.mapLayersService.SensorsLayer,
        this.mapLayersService.WebGlStatsLayer,
        this.mapLayersService.HeatMapLayer,
        this.mapLayersService.MplNaviLayer,
        this.mapLayersService.DummySelectLayer,
        this.mapLayersService.DrawRectangleSelectLayer,
        
      ],
      controls: defaultControls({ zoom: false, attribution: false }).extend([]),
      view: new View({
        center: olProj.transform(this.smartCityMapConfig.center, 'EPSG:4326', 'EPSG:3857'),
        projection: 'EPSG:3857',
        extent: [2622261, 4569699, 2662125, 4587458],
        zoom: this.smartCityMapConfig.zoomLevel
      })
    });

    this.mapLayersService.SensorsLayer.getSource().on('addfeature', (e) => {
      const flashInterval = setInterval(() => {
        this.flashFeature(e.feature);
        this.smartCityMap.render();
      }, 2000);
      this.flashIntervals.push(flashInterval);
    });

    this.tooltip = document.getElementById('tooltip');
    this.overlay = new Overlay({
      element: this.tooltip,
      offset: [10, 0],
      positioning: 'bottom-left'
    });
    this.smartCityMap.addOverlay(this.overlay);

    this.drawInt = new Draw({
      source: new VectorSource({}),
      type: 'Circle',
      geometryFunction: createBox(),
    });
    this.smartCityMap.addInteraction(this.drawInt);
    this.drawInt.setActive(false);
  
  }
  

  public flashFeature(feature: FeatureLike): void {
    const featVal = parseInt(feature.get('value'));
    const intLimits = feature.get('intensity_limits').split(',');
    const duration = featVal< intLimits[0] ?  3000 : (featVal< intLimits[1] &&  featVal> intLimits[0]) ? 2000 : 1000;
    const start = Date.now();
    const flashGeom: Geometry = (feature.getGeometry() as Geometry).clone();

    const listenerKey = this.mapLayersService.SensorsLayer.on('postrender', (event: any) => {
      const frameState = event.frameState;
      const elapsed = frameState.time - start;
      if (elapsed >= duration) {
        unByKey(listenerKey);
        return;
      }
      const vectorContext = getVectorContext(event);
      const elapsedRatio = elapsed / duration;
      
      const radius = easeOut(elapsedRatio) * (featVal< intLimits[0] ?  20 : (featVal< intLimits[1] &&  featVal> intLimits[0]) ? 30 : 40);
      const opacity = easeOut(1 - elapsedRatio);

      const style = new Style({
        image: new Circle({
          radius: radius,
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, ' + opacity + ')',
            width: 1.25 + opacity,
          }),
        }),
      });

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      this.smartCityMap.render();
    });
    
  }

  public stopFlashIntervals(): void{
    this.flashIntervals.forEach(int => clearInterval(int));
  }
  

  public onMapClicked(event: MapBrowserEvent<UIEvent>): void {
    if (this.drawInt.getActive() === true) return; 
    this.mapLayersService.DummySelectLayer.getSource().clear();
    this.overlay.setPosition(undefined);
    if (this.mapMode === MapMode.stats){
      const feature = this.mapLayersService.webGlStatsSource.getClosestFeatureToCoordinate(event.coordinate);
      if (!feature || this.mapStatsService.getFeatureVisiblity(feature) === 0) return;

      const featCenter = feature.getGeometry().getClosestPoint(event.coordinate);
      const dist  = new LineString([event.coordinate, featCenter]).getLength();
      if (feature && dist < 20 && this.mapStatsService.selectedStatsIndex) {
        this.overlay.setPosition(getCenter(feature.getGeometry().getExtent()));

        this.tooltip.innerHTML = this.mapStatsService.selectedStatsIndex.type === StatTypes.number ?
        parseInt(feature.get(this.mapStatsService.selectedStatsIndex.code))-1 + '' :
        this.mapStatsService.selectedStatsIndex.classes
        .find((cls) => feature.get(this.mapStatsService.selectedStatsIndex.code) === cls.value)?.label;
        
        this.mapLayersService.DummySelectLayer.getSource().addFeature(feature);
      }
    } else {
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
            case VectorLayerNames.sens: {
              this.sensorsService.showReportGraph(Number(feature.getId()), Number(feature.get('live_report_id')), feature.get('mpl_imageid'));
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
        hitTolerance: 2
      });
    }
  }


  private onModeChange(mode: MapMode): void{

    this.mapStatsService.statDialogRef?.close();
    this.mapMapillaryService.mplDataDialogRef?.close();

    const msg = 
    (mode === 'street') ? this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.MODE-MPLR')}) : 
    (mode === 'sens') ? this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.MODE-SENSORS')}) : 
    (mode === 'stats') ? this.translatePipe.transform('MAP.MAP-MODE', {msg:this.translatePipe.transform('MAP.SUBJECTIVE-FACTORS')}) : 
    "Error: no such mode";

    this.mapMessagesService.showMapMessage({
      message: msg ,
      action: '',
      duration: 3000, 
      hPosition: 'center', 
      vPosition: 'bottom',
      styleClass: 'map-snackbar'
    });
    this.sensorsService.stopReportAutoLoad();
    

    switch(mode) { 
      case MapMode.street: { 
         this.mapLayersService.MlSequencesLayer.setVisible(this.mapLayersService.checkedSeq);
         this.mapLayersService.MlImagesLayer.setVisible(this.mapLayersService.checkedImg);
         this.mapLayersService.MlPointsLayer.setVisible(true);
         this.mapLayersService.WebGlStatsLayer.setVisible(false);
         this.mapLayersService.HeatMapLayer.setVisible(false);
         this.mapLayersService.SensorsLayer.setVisible(false);
         this.mapLayersService.DrawRectangleSelectLayer.setVisible(false);
         break; 
      } 
      case MapMode.stats: { 
         this.mapLayersService.MlSequencesLayer.setVisible(false);
         this.mapLayersService.MlImagesLayer.setVisible(false);
         this.mapLayersService.MlPointsLayer.setVisible(false);
         this.mapLayersService.WebGlStatsLayer.setVisible(true);
         this.mapLayersService.HeatMapLayer.setVisible(this.mapStatsService.heatEnable);
         this.mapLayersService.SensorsLayer.setVisible(false);
         this.mapLayersService.DrawRectangleSelectLayer.setVisible(true);
         break; 
      } 
      case MapMode.sens: { 
        this.mapLayersService.MlSequencesLayer.setVisible(false);
        this.mapLayersService.MlImagesLayer.setVisible(false);
        this.mapLayersService.MlPointsLayer.setVisible(false);
        this.mapLayersService.WebGlStatsLayer.setVisible(false);
        this.mapLayersService.HeatMapLayer.setVisible(false);
        this.mapLayersService.SensorsLayer.setVisible(true);
        this.mapLayersService.DrawRectangleSelectLayer.setVisible(false);
        this.sensorsService.initSensors();        
        break; 
      } 
      default: { 
        console.error(`No such mode error: ${ mode }.`);
        break; 
      } 
   } 
  }


}
