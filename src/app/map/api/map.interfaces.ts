import { Coordinate } from "ol/coordinate";
import Layer from "ol/layer/Layer";
import Map from "ol/Map";

export enum TileLayerNames {
    OsmLayer = 'OSM',
    GosmLayer = 'GOSM',
    cartoDarkLayer = 'CARTODARK',
    none = 'NONE'
}


export enum MapillaryLayerNames {
    seq = 'mpl_sequences',
    img = 'mpl_images',
    point = 'mpl_points'
}

export interface SmartCityMapConfig {
    mapDivId: string;
    mapillaryDivId: string;
    zoomLevel: number;
    center: Coordinate;
    layers: Layer<any>[];
}

export interface MapillaryViewerConfig {
    imageId: string;
    mapillaryDivId: string;
    map: Map;
}

