import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import Olmap from 'ol/Map';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { VectorLayerNames } from './map.enums';


export interface SmartCityMapConfig {
    mapDivId: string;
    mapillaryDivId: string;
    zoomLevel: number;
    center: Coordinate;
}

export interface SmartCityMapillaryConfig {
    imageId: string;
    mapillaryDivId: string;
    map: Olmap;
    detections?: DetectionFeature[];
    imageCenter?: number[];
}

export interface DetectionFeatureDB {
    geometry: string;
    image_id: string;
    feature_id: string;
    value: string;
}

export interface DetectionFeature {
    geometries: DetectionGeometry[];
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
    dbprojection: olProj.Projection;
    layerName: VectorLayerNames;
    format: GeoJSON;
    source: VectorSource<Geometry>;
}

