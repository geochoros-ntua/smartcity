import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Fill, Icon, Stroke, Style, Circle, Text } from 'ol/style';

@Injectable({
  providedIn: 'root'
})
export class MapStyleService {

  public mplSquencesStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2
    })
  });

  public mplPointStyle = new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({ color: 'blue' }),
      stroke: new Stroke({
        color: [255, 255, 255], width: 1
      })
    })
  });

  /**
   * This is the bearing style. Indicating the azimuthal of the point of view
   * @param Feature a map feature representing the mapillary image point shown.
   * @returns Style[]
   */
  public mplImagePointsStyle(feature: Feature<Point>): Style[] {
    const rotation = feature.get('compass_angle') * Math.PI / 180;
    // console.log('rotation', rotation)
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
