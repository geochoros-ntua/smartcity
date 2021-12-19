import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import RenderFeature from 'ol/render/Feature';
import { Fill, Icon, Stroke, Style, Circle, Text } from 'ol/style';

@Injectable({
  providedIn: 'root'
})

export class MapStyleService {

  private mplPointStyleCache: Map<string, Style>;


  constructor() {
    this.mplPointStyleCache = new Map();
  }


  public mplSquencesStyle: Style = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2
    })
  });

  public mplImgPointStyle: Style = new Style({
    image: new Circle({
      radius: 3,
      fill: new Fill({ color: [0, 0, 255, 0.7] }),
      stroke: new Stroke({
        color: [0, 0, 255, 0.7], width: 1
      })
    })
  });


  public mplPointStyle = (feature: Feature<Geometry> | RenderFeature): Style => {
    const value = feature.get('value');
    const cStyle = this.mplPointStyleCache.get(value);
    if (!cStyle) {
      const style = new Style({
        image: new Icon({
          src: 'assets/package_objects/' + feature.get('value') + '.svg'
        })
      });
      this.mplPointStyleCache.set(value,style);
    }
    return cStyle!;
  }

  /**
   * This is the bearing style. Indicating the azimuthal of the point of view
   * @param Feature a map feature representing the mapillary image point shown.
   * @returns Style[]
   */
   public mplImagePointsStyle(feature: Feature<Geometry> | RenderFeature): Style[] {
    const rotation: number = feature.get('compass_angle') * Math.PI / 180;
    const bearingStyle: Style = new Style({
      text: new Text({
        text: '\uf1eb',
        scale: 1.2,
        font: 'normal 18px FontAwesome',
        offsetY: -10,
        rotation,
        fill: new Fill({ color: 'red' }),
        stroke: new Stroke({ color: 'red', width: 3 })
      })
    });
    const faCircleSolidStyle: Style = new Style({
      text: new Text({
        text: '\uf111',
        scale: 1,
        font: 'normal 18px FontAwesome',
        fill: new Fill({ color: 'orange' }),
        stroke: new Stroke({ color: 'white', width: 4 })
      }),
    });
    return [bearingStyle, faCircleSolidStyle];
  }

  
}
