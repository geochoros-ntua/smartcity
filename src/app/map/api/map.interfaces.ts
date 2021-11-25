import { Coordinate } from "ol/coordinate";

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
}

