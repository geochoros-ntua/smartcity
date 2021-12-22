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
import { LoadingMethodObject } from '../api/map.interfaces';
import { MapillaryLayerNames } from '../api/map.enums';



@Injectable({
  providedIn: 'root'
})
export class MapLayersService {

  private MPL_PRIVATE_URL = 'https://smartcity.fearofcrime.com/php/loadMapilaryData.php';

  private OSMLayer!: TileLayer<OSM>;
  private GOSMLayer!: TileLayer<OSM>;
  private cartoDBDark!: TileLayer<XYZ>;

  private mplSeqSource!: VectorSource<LineString | MultiLineString>;
  private MPL_SEQUENCES!: VectorLayer<VectorSource<LineString | MultiLineString>>;

  private mplImgource!: VectorSource<Point>;
  private MPL_IMAGES!: VectorLayer<VectorSource<Point>>;

  private mplPntSource!: VectorSource<Point>;
  private MPL_POINTS!: VectorLayer<VectorSource<Point>>;

  private mplFormat: GeoJSON;

  private selectionLayer!: VectorLayer<VectorSource<Geometry>>;

  constructor(private http: HttpClient, private mapStyleService: MapStyleService) {
    this.mplFormat = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
  }

  public initLayers(): void {
    this.initCartoDarkLayer(true);
    this.initOSMLayer(false);
    this.initGOSMLayer(false);
    this.initMapillarySequences(true);
    this.initMapillaryImages(true);
    this.initMapillaryPoints(true);
    this.initSelectionLayer(true);
  }

  public get GosmLayer(): TileLayer<OSM> {
    return this.GOSMLayer;
  }

  public get OsmLayer(): TileLayer<OSM> {
    return this.OSMLayer;
  }

  public get cartoDarkLayer(): TileLayer<XYZ> {
    return this.cartoDBDark;
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

  public get SelectionLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.selectionLayer;
  }

  /**
   * PRIVATES
   */

  private initSelectionLayer = (visible: boolean): void => {
    this.selectionLayer = new VectorLayer({
      source: new VectorSource<Geometry>(),
      visible,
      style: this.mapStyleService.mplImagePointsStyle
    });
  }


  private initOSMLayer = (visible: boolean): void => {
    this.OSMLayer = new TileLayer({
      visible,
      source: new OSM()
    });
  }


  private initGOSMLayer = (visible: boolean): void => {
    this.GOSMLayer = new TileLayer({
      visible,
      source: new OSM({
        url: 'http://mt{0-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
      })
    });
  }


  private initCartoDarkLayer = (visible: boolean): void => {
    this.cartoDBDark = new TileLayer({
      visible,
      source: new XYZ({
        url: 'https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
      })
    });
  }


  private initMapillarySequences = (visible: boolean): void => {
    this.mplSeqSource = new VectorSource({
      format: this.mplFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          layerName: MapillaryLayerNames.seq,
          source: this.mplSeqSource
        });
      }
    });
    this.MPL_SEQUENCES = new VectorLayer({
      visible,
      opacity: 1.0,
      minZoom: 10,
      maxZoom: 17,
      style: this.mapStyleService.mplSquencesStyle,
      source: this.mplSeqSource
    });
  }



  private initMapillaryImages = (visible: boolean): void => {

    this.mplImgource = new VectorSource({
      format: this.mplFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          layerName: MapillaryLayerNames.img,
          source: this.mplImgource
        });
      }
    });

    this.MPL_IMAGES = new VectorLayer({
      visible,
      opacity: 0.7,
      minZoom: 17,
      // renderBuffer: 100,
      style: this.mapStyleService.mplImgPointStyle,
      source: this.mplImgource
    });
  }



  private initMapillaryPoints = (visible: boolean): void => {

    this.mplPntSource = new VectorSource({
      format: this.mplFormat,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        this.loadingFn({
          extent,
          resolution,
          projection,
          layerName: MapillaryLayerNames.point,
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
  }

  private loadingFn(loadingMethodObject: LoadingMethodObject): void {
    const minCoords = olProj.transform([loadingMethodObject.extent[0], loadingMethodObject.extent[1]], 'EPSG:3857', 'EPSG:4326');
    const maxCoords = olProj.transform([loadingMethodObject.extent[2], loadingMethodObject.extent[3]], 'EPSG:3857', 'EPSG:4326');
    const filterPolCoords =
      `${minCoords[0].toFixed(4)} ${minCoords[1].toFixed(4)}, ` +
      `${maxCoords[0].toFixed(4)} ${minCoords[1].toFixed(4)}, ` +
      `${maxCoords[0].toFixed(4)} ${maxCoords[1].toFixed(4)}, ` +
      `${minCoords[0].toFixed(4)} ${maxCoords[1].toFixed(4)}, ` +
      `${minCoords[0].toFixed(4)} ${minCoords[1].toFixed(4)}`;

    this.http.get(this.MPL_PRIVATE_URL +
      '?layer=' + loadingMethodObject.layerName +
      '&bbox=' + filterPolCoords)
      .subscribe(data => {
        console.log('data', data);
        loadingMethodObject.source.addFeatures(this.mplFormat.readFeatures(data));
      });
  }
}
