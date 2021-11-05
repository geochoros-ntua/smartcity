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


@Injectable({
  providedIn: 'root'
})
export class MapLayersService {

  private MPL_PRIVATE_URL = 'https://smartcity.fearofcrime.com/php/loadMapilaryData.php';

  private OSMLayer: TileLayer<OSM>;
  private GOSMLayer: TileLayer<OSM>;
  private cartoDBDark: TileLayer<XYZ>;

  private mplSeqSource: VectorSource<LineString | MultiLineString>;
  private MPL_SEQUENCES: VectorLayer<VectorSource<LineString | MultiLineString>>;

  private mplImgource: VectorSource<Point>;
  private MPL_IMAGES: VectorLayer<VectorSource<Point>>;

  private selectionLayer: VectorLayer<VectorSource<Geometry>>;


  constructor(private http: HttpClient, private mapStyleService: MapStyleService) {

  }


  public initLayers(): void {
    this.initCartoDarkLayer();
    this.initOSMLayer();
    this.initGOSMLayer();
    this.initMapillarySequences();
    this.initMapillaryImages();
    this.initSelectionLayer();
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

  public get SelectionLayer(): VectorLayer<VectorSource<Geometry>> {
    return this.selectionLayer;
  }

  /**
   * PRIVATES
   */

  private initSelectionLayer = (): void => {
    this.selectionLayer = new VectorLayer({
      source: new VectorSource<Geometry>(),
      style: this.mapStyleService.mplImagePointsStyle
    });
  }


  private initOSMLayer = (): void => {
    this.OSMLayer = new TileLayer({
      visible: false,
      source: new OSM()
    });
  }


  private initGOSMLayer = (): void => {
    this.GOSMLayer = new TileLayer({
      visible: true,
      source: new OSM({
        url: 'http://mt{0-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
      })
    });
  }


  private initCartoDarkLayer = (): void => {
    this.cartoDBDark = new TileLayer({
      visible: false,
      source: new XYZ({
        url: 'https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
      })
    });
  }


  private initMapillarySequences = (): void => {
    const format = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    this.mplSeqSource = new VectorSource({
      format,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        const minCoords = olProj.transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
        const maxCoords = olProj.transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');
        const filterPolCoords =
          minCoords[0].toFixed(4) + ' ' + minCoords[1].toFixed(4) + ', ' +
          maxCoords[0].toFixed(4) + ' ' + minCoords[1].toFixed(4) + ', ' +
          maxCoords[0].toFixed(4) + ' ' + maxCoords[1].toFixed(4) + ', ' +
          minCoords[0].toFixed(4) + ' ' + maxCoords[1].toFixed(4) + ', ' +
          minCoords[0].toFixed(4) + ' ' + minCoords[1].toFixed(4);

        this.http.get(this.MPL_PRIVATE_URL + '?layer=sequences&bbox=' + filterPolCoords)
          .subscribe(data => {
            this.mplSeqSource.addFeatures(format.readFeatures(data));
          });
      }
    });
    this.MPL_SEQUENCES = new VectorLayer({
      visible: true,
      opacity: 1.0,
      minZoom: 10,
      maxZoom: 17,
      style: this.mapStyleService.mplSquencesStyle,
      source: this.mplSeqSource
    });
  }



  private initMapillaryImages = (): void => {

    const format = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });

    this.mplImgource = new VectorSource({
      format,
      strategy: bboxStrategy,
      loader: (extent, resolution, projection) => {
        const minCoords = olProj.transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
        const maxCoords = olProj.transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');
        const filterPolCoords =
          minCoords[0].toFixed(4) + ' ' + minCoords[1].toFixed(4) + ', ' +
          maxCoords[0].toFixed(4) + ' ' + minCoords[1].toFixed(4) + ', ' +
          maxCoords[0].toFixed(4) + ' ' + maxCoords[1].toFixed(4) + ', ' +
          minCoords[0].toFixed(4) + ' ' + maxCoords[1].toFixed(4) + ', ' +
          minCoords[0].toFixed(4) + ' ' + minCoords[1].toFixed(4);

        this.http.get(this.MPL_PRIVATE_URL + '?layer=images&bbox=' + filterPolCoords)
          .subscribe(data => {
            console.log('data', data);
            this.mplImgource.addFeatures(format.readFeatures(data));
          });
      }
    });

    this.MPL_IMAGES = new VectorLayer({
      visible: true,
      opacity: 0.7,
      minZoom: 17,
      style: this.mapStyleService.mplPointStyle,
      source: this.mplImgource
    });
  }

}
