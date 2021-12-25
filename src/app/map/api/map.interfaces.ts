import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import Geometry from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { MapillaryLayerNames } from './map.enums';


export interface SmartCityMapConfig {
    mapDivId: string;
    mapillaryDivId: string;
    zoomLevel: number;
    center: Coordinate;
    layers: (VectorLayer<VectorSource<Geometry>> | TileLayer<OSM> | TileLayer<XYZ>) [];
}

export interface SmartCityMapillaryConfig {
    imageId: string;
    mapillaryDivId: string;
    map: Map;
    detection?: DetectionFeature;
}

export interface DetectionFeature {
    geometries: DetectionGeometry[];
    image_id: string;
    feature_id: string;
    value: string;
    extentArea: number;
}

export interface DetectionFeatureDB {
    geometry: string;
    image_id: string;
    feature_id: string;
    value: string;
    extentArea: number;
}

export interface DetectionGeometry {
    type: string;
    coordinates: number[][];
}

export interface LoadingMethodObject {
    extent: Extent;
    resolution: number;
    projection: olProj.Projection;
    layerName: MapillaryLayerNames;
    source: VectorSource<Point | LineString | MultiLineString>;
}

