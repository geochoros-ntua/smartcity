import { Fill, Stroke, Style } from "ol/style";
import Circle from "ol/style/Circle";
import { DummyStyle } from "./map.api";

export const DUMMY_STYLES: DummyStyle = {
    'Point': new Style({
      image: new Circle({
        radius: 10,
        fill: null,
        stroke: new Stroke({color: 'blue', width: 5}),
      }),
    }),
    'LineString': new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 5,
      }),
    }),
    'LinearRing': new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 5,
      }),
    }),
    'MultiLineString': new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 5,
      }),
    }),
    'MultiPoint': new Style({
      image: new Circle({
        radius: 5,
        fill: null,
        stroke: new Stroke({color: 'blue', width: 1}),
      }),
    }),
    'MultiPolygon': new Style({
      stroke: new Stroke({
        color: 'yellow',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.1)',
      }),
    }),
    'Polygon': new Style({
      stroke: new Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    }),
    'GeometryCollection': new Style({
      stroke: new Stroke({
        color: 'magenta',
        width: 2,
      }),
      fill: new Fill({
        color: 'magenta',
      }),
      image: new Circle({
        radius: 10,
        fill: null,
        stroke: new Stroke({
          color: 'magenta',
        }),
      }),
    }),
    'Circle': new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.2)',
      }),
    }),
  }