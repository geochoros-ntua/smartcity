import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import Layer from 'ol/layer/Layer';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { MapillaryLayerNames } from './map.enums';


export interface SmartCityMapConfig {
    mapDivId: string;
    mapillaryDivId: string;
    zoomLevel: number;
    center: Coordinate;
    layers: Layer<any>[];
}

export interface SmartCityMapillaryConfig {
    imageId: string;
    mapillaryDivId: string;
    map: Map;
    detection?: DetectionFeature;
}

export interface DetectionFeature {
    geometry: DetectionGeometry[];
    image_id: string;
    feature_id: string;
    value: string;
    extentArea?: number;
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

