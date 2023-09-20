import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import * as olProj from 'ol/proj';
import { HttpClient } from '@angular/common/http';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { MapStyleService } from './map.styles.service';
import MultiLineString from 'ol/geom/MultiLineString';
import Geometry from 'ol/geom/Geometry';
import { LoadingMethodObject } from '../api/map.api';
import { StatLayers, StatTypes, VectorLayerNames } from '../api/map.enums';
import { FEATURE_GROUPS, STATS_INDECES } from '../api/map.datamaps';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { BehaviorSubject } from 'rxjs';
import TileWMS from 'ol/source/TileWMS';
import MapUtils from '../map.helper';
import { VectorImage } from 'ol/layer';
import { Fill, Stroke, Style } from 'ol/style';
import { WebGLLayer } from '../api/WebGLLayer';
import { StatsService } from './map.stats.service';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { DUMMY_STYLES } from '../api/map.default.styles';
import Feature, { FeatureLike } from 'ol/Feature';
import { Heatmap } from 'ol/layer';

import {getCenter} from 'ol/extent'
import { MapService } from './map.service';


/**
 * Author: p.tsagkis
 * Date: 7/2022
 */


@Injectable({
  providedIn: 'root'
})
export class MapLayersService {

  private MPL_PRIVATE_URL = MapUtils.backEndBaseUrl + 'loadMapilaryData.php';
  private SENSORS_URL = MapUtils.backEndBaseUrl + 'loadSensors.php';

  private OSMLayer!: TileLayer<OSM>;
  private GOSMLayer!: TileLayer<OSM>;
  private cartoDBDark!: TileLayer<XYZ>;
  private cartoDBLight!: TileLayer<XYZ>;
  private KTIMALayer!: TileLayer<TileWMS>;
  

  private mplSeqSource!: VectorSource<LineString | MultiLineString>;
  private MPL_SEQUENCES!: VectorLayer<VectorSource<LineString | MultiLineString>>;

  private mplImgource!: VectorSource<Point>;
  private MPL_IMAGES!: VectorLayer<VectorSource<Point>>;

  private mplPntSource!: VectorSource<Point>;
  private MPL_POINTS!: VectorLayer<VectorSource<Point>>;

  private ATHENS_MASK!: VectorImage<VectorSource<Polygon | MultiPolygon>>;
  private SENSORS!: VectorLayer<VectorSource<Point>>;

  public webGlStatsSource!: VectorSource<Point>;
  private WEBGL_STATS!: WebGLLayer | WebGLPointsLayer<VectorSource<Point>>;

  public heatMapSource!: VectorSource<Point>;
  private HEATMAP_LAYER!: Heatmap;


  private mplFormat: GeoJSON;

  private mplNaviPointLayer!: VectorLayer<VectorSource<Geometry>>;

  private dummySelectLayer!: VectorLayer<VectorSource<Geometry>>;

  private drawRectangleSelectLayer!: VectorLayer<VectorSource<Geometry>>;

  public selectedFeatureGroups!: string[];
  public selectedFeatureGroups$: BehaviorSubject<string[]> = new BehaviorSubject(Array.from( [...FEATURE_GROUPS.keys(), '0']));
  public checkedSeq = true;
  public checkedImg = true;
  public dataLoaded: boolean = true;
  public heatBlur: number = 35;
  public heatRadius: number = 15;

  private firstTimeWebGl: boolean = true;
  private linkIndex: any = null;

  constructor(
    private http: HttpClient, 
    private mapStatsService: StatsService, 
    private mapStyleService: MapStyleService) {
    // format to read the mpl 4326 layers response
    this.mplFormat = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
 
    // if less than six groups selected 
    // then set a lower zoom level
    // give to the user some more point to view

    this.selectedFeatureGroups$.subscribe( (groups: string[]) => {
          this.selectedFeatureGroups = groups;
          if (groups.length > 3){
            this.MPL_POINTS?.setMinZoom(18);
          } else {
            this.MPL_POINTS?.setMinZoom(5);
          }
    });
  }

  /**
   * intitilaise all the layers
   * consisting our map. 
   * Starts we street view mode
   * named Athens eye
   */
  public initLayers(): void {
    // tile layers

    this.initCartoDarkLayer(true);
    this.initCartoLightLayer(true);
    this.initOSMLayer(false);
    this.initGOSMLayer(false);
    // ktimatologio
    this.initKtimaLayer(false);
    // vectors
    // outline cosmetic layer
    this.initMaskLayer();
    // mplr vector layers
    this.initMapillarySequences(true);
    this.initMapillaryImages(true);
    this.initMapillaryPoints(true);
     // draw bbox select
     this.initDrawRectLayer(true);
    // factors layers
    this.initWebGlStatsLayer(false);
    this.initHeatmapLayer(false);
    // sensors layer
    this.initSensorLayer(false);
    // mapillary select layer
    this.initSelectionLayer(true);
    // scrap layer
    this.initDummySelectLayer(true);
   
  }

  private get isLineGeom(): boolean {
    return [StatLayers.audit_lines, StatLayers.street_lines, StatLayers.crossings].includes(this.mapStatsService.selectedStatsLayer);
  }

  public get GosmLayer(): TileLayer<OSM> {
    return this.GOSMLayer;
  }

  public get OsmLayer(): TileLayer<OSM> {
    return this.OSMLayer;
  }

  public get KtimaLayer(): TileLayer<TileWMS> {
    return this.KTIMALayer;
  }

  public get cartoDarkLayer(): TileLayer<XYZ> {
    return this.cartoDBDark;
  }

  public get cartoLightLayer(): TileLayer<XYZ> {
    return this.cartoDBLight;
  }

  public get MlSequencesLayer(): VectorLayer<VectorSource<LineString | MultiLineString>> {
    return this.MPL_SEQUENCES;
  }

  public get MlImagesLayer(): VectorLayer<VectorSource<Point>> {
    return this.MPL_IMAGES;
  }

  public get MlPointsLayer(): VectorLayer<VectorSource<Point>> {
    return this.MPL_POINTS;
  }

  public get SensorsLayer(): VectorLayer<VectorSource<Point>> {
    return this.SENSORS;
  }

  public get MplNaviLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.mplNaviPointLayer;
  }

  public get DummySelectLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.dummySelectLayer;
  }

  public get DrawRectangleSelectLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.drawRectangleSelectLayer;
  }

  public get MaskLayer(): VectorImage<VectorSource<Geometry>> {
    return this.ATHENS_MASK;
  }

  public get WebGlStatsLayer(): WebGLLayer | WebGLPointsLayer<VectorSource<Point>>{
    return this.WEBGL_STATS;
  }

  public get HeatMapLayer(): Heatmap {
    return this.HEATMAP_LAYER;
  }


  /**
   * set for all vectors the opacity
   * This is common for every layer, so keep it simple
   * @param value opacity number
   */
  public setVectorLayersOpacity(value: number): void{
      this.MPL_IMAGES.setOpacity(value);
      this.MPL_SEQUENCES.setOpacity(value);
      this.MPL_POINTS.setOpacity(value);
      this.SENSORS.setOpacity(value);
      this.WEBGL_STATS.setOpacity(value);
  }


  public initWebGlStatsLayer(visible: boolean, index?: any){
    this.linkIndex = index;
    const myurl = './assets/geodata/'+Object.keys(StatLayers).find(
      key => StatLayers[key as keyof typeof StatLayers] === this.mapStatsService.selectedStatsLayer
      ) +'.json';
    
    this.webGlStatsSource = new VectorSource({
      url: myurl,
      format: new GeoJSON({
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });
    if (this.isLineGeom){
      this.WEBGL_STATS = new WebGLLayer(this.mapStatsService,{
        source: this.webGlStatsSource,
        visible
      });
    } else {
      this.WEBGL_STATS = new WebGLPointsLayer({
        source: this.webGlStatsSource,
        visible,
        style: this.mapStatsService.getStyleForWebGlPointLayer()
      });
    }
    this.WEBGL_STATS.set('name', 'webgl_stats_layer');

    this.webGlStatsSource.once('featuresloadend', () => {
      if (this.firstTimeWebGl){
        this.mapStatsService.selectedStatsIndex = this.linkIndex ? 
        STATS_INDECES.find(idx => idx.code === this.linkIndex) : 
        STATS_INDECES.find(idx => idx.code === 'A_14');

        console.log('this.mapStatsService.selectedStatsIndex', this.mapStatsService.selectedStatsIndex);

        this.mapStatsService.numericClasses = this.mapStatsService.selectedStatsIndex.type === StatTypes.number ?
        this.mapStatsService.getNumericClasses(this.mapStatsService.selectedStatsIndex) : 
        [];
        this.mapStatsService.generateClassColors();
        // this.mapService.smartCityMap.render();
        this.WebGlStatsLayer.getSource().changed();
        this.firstTimeWebGl = false;
      }
    });
  }


  public initHeatmapLayer(visible: boolean){
    
    const allVals: any = this.webGlStatsSource.getFeatures()
    .filter(ff=> this.mapStatsService.getFeatureVisiblity(ff) === 1)
    .map(f => f.getGeometry())
    .map((g:any) => {
      return {
        length: this.isLineGeom ? g.getLineString().getLength() : 1, 
        center: this.isLineGeom ? getCenter(g.getLineString().getExtent()) : g.getCoordinates()
      };
    });
    const maxLength = Math.max(...allVals.map((val: string | any[]) => val.length));
    const pointFeats = allVals.map((val: any) => {
      return new Feature({
        length: val.length,
        geometry: new Point(val.center)
      });
    })
    this.heatMapSource = new VectorSource<Point>();
    this.heatMapSource.addFeatures(pointFeats);
    this.HEATMAP_LAYER = new Heatmap({
      source: this.heatMapSource,
      blur: this.heatBlur,
      radius: this.heatRadius,
      visible,
      weight:  (ff: any) => {
        return ff.get('length')/maxLength;
      },
    });

  }

  /**
   * PRIVATES
   */

  private initMaskLayer(){
      this.ATHENS_MASK = new VectorImage({
        source: new VectorSource({
          url:'./assets/geodata/athens_mask.json',
          format: new GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
        }),

        visible: true,
        style: (feat, res) => {
          return new Style({
            stroke: new Stroke({
              color: 'black',
              width: 1.25
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.7)'
            })
          })
        },
      }); 
      this.ATHENS_MASK.set('name', 'athens_outline')
  }

  
  private initSelectionLayer = (visible: boolean): void => {
    this.mplNaviPointLayer = new VectorLayer({
      source: new VectorSource<Geometry>(),
      visible,
      style: this.mapStyleService.mplImagePointsStyle
    });
  };

  private initDrawRectLayer = (visible: boolean): void => {
    this.drawRectangleSelectLayer = new VectorLayer({
      source: new VectorSource<Geometry>(),
      visible,
      style: this.mapStyleService.drawRectangleStyle
    });
    this.drawRectangleSelectLayer.set('name', 'draw_rectangle_layer');
  };


  private initDummySelectLayer = (visible: boolean): void => {
    this.dummySelectLayer = new VectorLayer({
      source: new VectorSource<Geometry>(),
      visible,
      zIndex: 9999,
      style: (f:FeatureLike) => {
        return this.mapStyleService.dummyStyleFn(f, DUMMY_STYLES);
      }
    });
  };


  private initOSMLayer = (visible: boolean): void => {
    this.OSMLayer = new TileLayer({
      visible,
      source: new OSM()
    });
  };


  private initGOSMLayer = (visible: boolean): void => {
    this.GOSMLayer = new TileLayer({
      visible,
      source: new OSM({
        url: 'http://mt{0-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
      })
    });
  };

  private initKtimaLayer = (visible: boolean): void => {
    this.KTIMALayer =  new TileLayer({
      visible,
      source: new TileWMS({
        url: 'https://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx',
        params: {'LAYERS': 'KTBASEMAP', 'TILED': true},
      }),
    })
  };


  private initCartoLightLayer = (visible: boolean): void => {
    this.cartoDBLight = new TileLayer({
      visible,
      source: new XYZ({
        url: 'https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
      })
    });
  };


  private initCartoDarkLayer = (visible: boolean): void => {
    this.cartoDBDark = new TileLayer({
      visible,
      source: new XYZ({
        url: 'https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
      })
    });
  };


  private initMapillarySequences = (visible: boolean): void => {
    this.mplSeqSource = new VectorSource({
      format: this.mplFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.mplFormat,
          dbprojection: olProj.get('EPSG:4326'),
          layerName: VectorLayerNames.seq,
          source: this.mplSeqSource
        });
      }
    });
    this.MPL_SEQUENCES = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 10,
      maxZoom: 17,
      style: this.mapStyleService.mplSquencesStyle,
      source: this.mplSeqSource
    });
  };


  private initMapillaryImages = (visible: boolean): void => {

    this.mplImgource = new VectorSource({
      format: this.mplFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.mplFormat,
          dbprojection: olProj.get('EPSG:4326'),
          layerName: VectorLayerNames.img,
          source: this.mplImgource
        });
      }
    });

    this.MPL_IMAGES = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 17,
      style: this.mapStyleService.mplImgPointStyle,
      source: this.mplImgource
    });
  };



  private initMapillaryPoints = (visible: boolean): void => {

    this.mplPntSource = new VectorSource({
      format: this.mplFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.mplFormat,
          dbprojection: olProj.get('EPSG:4326'),
          layerName: VectorLayerNames.point,
          source: this.mplPntSource
        });
      }
    });

    this.MPL_POINTS = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 18,
      style: (feature) => this.mapStyleService.mplPointStyle(feature),
      source: this.mplPntSource
    });
  };

  private initSensorLayer = (visible: boolean): void => {

    this.SENSORS = new VectorLayer({
      visible,
      opacity:0.7,
      style: (feature) => this.mapStyleService.sensorPointStyleFn(feature),
      source:new VectorSource({
          format: new GeoJSON({
            dataProjection:'EPSG:3857',
            featureProjection:'EPSG:3857',
            geometryName:'geometry'
          }),
          url: this.SENSORS_URL,
          wrapX:false
      })
    });
  }

  /**
   * This is a common loading method for all layers maintained within the DB
   * Takes care of all the necessary tranformations to respect EPSG (4326 or 3857)
   * send the MBR request on the back end
   * receives back geojson features and 
   * updates the layer source with the features
   * @param loadingMethodObject 
   */
  private loadingFn(loadingMethodObject: LoadingMethodObject): void {

    const minCoords = olProj.transform(
      [loadingMethodObject.extent[0], loadingMethodObject.extent[1]], loadingMethodObject.projection, loadingMethodObject.dbprojection
    );

    const maxCoords = olProj.transform(
      [loadingMethodObject.extent[2], loadingMethodObject.extent[3]], loadingMethodObject.projection, loadingMethodObject.dbprojection
    );

    const filterPolCoords =
      `${minCoords[0].toFixed(4)} ${minCoords[1].toFixed(4)}, ` +
      `${maxCoords[0].toFixed(4)} ${minCoords[1].toFixed(4)}, ` +
      `${maxCoords[0].toFixed(4)} ${maxCoords[1].toFixed(4)}, ` +
      `${minCoords[0].toFixed(4)} ${maxCoords[1].toFixed(4)}, ` +
      `${minCoords[0].toFixed(4)} ${minCoords[1].toFixed(4)}`;

    this.dataLoaded = false;
    this.http.get(this.MPL_PRIVATE_URL +
      '?layer=' + loadingMethodObject.layerName +
      '&bbox=' + filterPolCoords +
      (loadingMethodObject.layerName === VectorLayerNames.point ?
        '&filter=' + this.selectedFeatureGroups.map(grp => "'" + grp + "'") :
        ''))
      .subscribe(data => {
        this.dataLoaded = true;
        loadingMethodObject.source.addFeatures(loadingMethodObject.format.readFeatures(data));
      });
  }

}
