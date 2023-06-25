import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import Olmap from 'ol/Map';
import * as olProj from 'ol/proj';
import RenderFeature from 'ol/render/Feature';
import VectorSource from 'ol/source/Vector';
import { StatLayers, StatTypes, VectorLayerNames } from './map.enums';
import { Style } from 'ol/style';
import { ExpressionValue } from 'ol/style/expressions';


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

export interface FeatureClickedWithPos {
    feat: RenderFeature | Feature<Geometry>;
    coord: Coordinate;
}

export interface GraphReport {
    title: string,
    label: string, 
    date: string, 
    value: string, 
}

export interface StatsIndices {
    code: string,
    label: string,
    type: StatTypes,
    layer: StatLayers,
    min?: number,
    max?: number,
    classes?: IndiceClass[]
}

export interface IndiceClass {
    label: string
    value?: number,
    min?: number,
    max?: number
   
}

export interface WebGlPointSymbol{ 
    filter: ExpressionValue,
    symbol: { 
        symbolType: string,
         size: number,  
         color: string | number[], 
         offset: number[], 
         opacity: number, 
    } 
}


export interface DummyStyle{
    Point: Style,
    LineString: Style,
    LinearRing: Style,
    MultiLineString: Style,
    MultiPoint: Style,
    MultiPolygon: Style,
    Polygon: Style,
    GeometryCollection: Style,
    Circle: Style
}


export interface IndexFilter{
    sindex: StatsIndices,
    values: IndiceClass[],
    classes: IndiceClass[]
}



