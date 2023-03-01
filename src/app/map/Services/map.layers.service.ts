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
import { VectorLayerNames } from '../api/map.enums';
import { FEATURE_GROUPS } from '../api/map.datamaps';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { BehaviorSubject } from 'rxjs';
import TileWMS from 'ol/source/TileWMS';
import MapUtils from '../map.helper';
import { VectorImage } from 'ol/layer';
import { Fill, Stroke, Style } from 'ol/style';

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

  private questDKSource!: VectorSource<Polygon | MultiPolygon>;
  private QUEST_DK!: VectorLayer<VectorSource<Polygon | MultiPolygon>>;

  private factorsDKSource!: VectorSource<Polygon | MultiPolygon>;
  private FACTORS_DK!: VectorLayer<VectorSource<Polygon | MultiPolygon>>;

  private factorsGeitSource!: VectorSource<Polygon | MultiPolygon>;
  private FACTORS_GEIT!: VectorLayer<VectorSource<Polygon | MultiPolygon>>;

  private factorsPedWaysSource!: VectorSource<Polygon | MultiPolygon>;
  private FACTORS_PEDESTRN!: VectorLayer<VectorSource<Polygon | MultiPolygon>>;

  private ATHENS_MASK!: VectorLayer<VectorSource<Polygon | MultiPolygon>>;

  private SENSORS!: VectorLayer<VectorSource<Point>>;


  private mplFormat: GeoJSON;

  private statsLayersFormat: GeoJSON;

  private selectionLayer!: VectorLayer<VectorSource<Geometry>>;

  public selectedFeatureGroups!: string[];

  public selectedFeatureGroups$: BehaviorSubject<string[]> = new BehaviorSubject(Array.from( [...FEATURE_GROUPS.keys(), '0']));

  public checkedSeq = true;
  public checkedImg = true;

  public dataLoaded:boolean;


  constructor(private http: HttpClient, private mapStyleService: MapStyleService) {
    // format to read the mpl 4326 layers response
    this.mplFormat = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    // format to read the stats 3857 layers response
    this.statsLayersFormat = new GeoJSON({
      dataProjection: 'EPSG:3857',
      featureProjection: 'EPSG:3857'
    });
    // if less than six groups selected 
    // then set a lower zoom level
    // give to the user some more point to view

    this.selectedFeatureGroups$.subscribe( (groups: string[]) => {
          this.selectedFeatureGroups = groups;
          if (groups.length > 6){
            this.MPL_POINTS?.setMinZoom(18);
          } else {
            this.MPL_POINTS?.setMinZoom(15);
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
    // questoniarry layer
    this.initQuestDKLayer(false);
    // factors layers
    this.initFactorsDKLayer(false);
    this.initFactorsGeitLayer(false);
    this.initFacorsPdstrLayer(false);
    // sensors layer
    this.initSensorLayer(false);
    // scrap layer
    this.initSelectionLayer(true);
    
  }

 

  public get GosmLayer(): TileLayer<OSM> {
    return this.GOSMLayer;
  }

  public get OsmLayer(): TileLayer<OSM> {
    return this.OSMLayer;
  }

  public get KtimaLayer(): TileLayer<OSM> {
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

  public get FactorsDKLayer(): VectorLayer<VectorSource<Polygon | MultiPolygon>> {
    return this.FACTORS_DK;
  }

  public get QuestDKLayer(): VectorLayer<VectorSource<Polygon | MultiPolygon>> {
    return this.QUEST_DK;
  }

  public get FactorsGeitLayer(): VectorLayer<VectorSource<Polygon | MultiPolygon>> {
    return this.FACTORS_GEIT;
  }

  public get FacorsPdstrLayer(): VectorLayer<VectorSource<Polygon | MultiPolygon>> {
    return this.FACTORS_PEDESTRN;
  }

  public get SensorsLayer(): VectorLayer<VectorSource<Point>> {
    return this.SENSORS;
  }

  public get SelectionLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.selectionLayer;
  }

  public get MaskLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.ATHENS_MASK;
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
      this.FACTORS_DK.setOpacity(value);
      this.FACTORS_GEIT.setOpacity(value);
      this.FACTORS_PEDESTRN.setOpacity(value);
      this.QUEST_DK.setOpacity(value);
      this.SENSORS.setOpacity(value);
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
    this.selectionLayer = new VectorLayer({
      source: new VectorSource<Geometry>(),
      visible,
      style: this.mapStyleService.mplImagePointsStyle
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

  private initFactorsDKLayer = (visible: boolean): void => {
    this.factorsDKSource = new VectorSource({
      format: this.statsLayersFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.statsLayersFormat,
          dbprojection: olProj.get('EPSG:3857'),
          layerName: VectorLayerNames.factors_dk,
          source: this.factorsDKSource
        });
      }
    });

    this.FACTORS_DK = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 10,
      maxZoom: 15,
      style: (feature) => this.mapStyleService.dummyStyleFn(feature),
      source: this.factorsDKSource
    });
  };

  private initFactorsGeitLayer = (visible: boolean): void => {
    this.factorsGeitSource = new VectorSource({
      format: this.statsLayersFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.statsLayersFormat,
          dbprojection: olProj.get('EPSG:3857'),
          layerName: VectorLayerNames.factors_geit,
          source: this.factorsGeitSource
        });
      }
    });

    this.FACTORS_GEIT = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 15,
      maxZoom: 17,
      style: (feature) => this.mapStyleService.dummyStyleFn(feature),
      source: this.factorsGeitSource
    });
  };


  private initFacorsPdstrLayer = (visible: boolean): void => {
    this.factorsPedWaysSource = new VectorSource({
      format: this.statsLayersFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.statsLayersFormat,
          dbprojection: olProj.get('EPSG:3857'),
          layerName: VectorLayerNames.factors_pdstr,
          source: this.factorsPedWaysSource
        });
      }
    });

    this.FACTORS_PEDESTRN = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 17,
      style: (feature) => this.mapStyleService.dummyStyleFn(feature),
      source: this.factorsPedWaysSource
    });
  };

  private initQuestDKLayer = (visible: boolean): void => {
    this.questDKSource = new VectorSource({
      format: this.statsLayersFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          format: this.statsLayersFormat,
          dbprojection: olProj.get('EPSG:3857'),
          layerName: VectorLayerNames.quest_dk,
          source: this.questDKSource
        });
      }
    });

    this.QUEST_DK = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 10,
      style: (feature) => this.mapStyleService.dummyStyleFn(feature),
      source: this.questDKSource
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
