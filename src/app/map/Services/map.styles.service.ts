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

  private styleCache: Map<string, Style>;
  private clusterStyleCache: Map<string, Style>;


  constructor() {
    this.styleCache = new Map();
    this.clusterStyleCache = new Map();
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
    const cStyle = this.styleCache[value];
    if (!cStyle) {
      const style = new Style({
        image: new Icon({
          src: 'assets/package_objects/' + feature.get('value') + '.svg'
        })
      });
      this.styleCache[value] = style;
    }
    return cStyle;
  }


  public mlImgClustrStyle = (feature: Feature<Geometry> | RenderFeature): Style => {
    const size = feature.get('features').length;
    let style = this.clusterStyleCache[size];
    if (!style) {
      const color = size > 25 ? '248, 128, 0' : size > 8 ? '248, 192, 0' : '128, 192, 64';
      const radius = Math.max(8, Math.min(size * 0.75, 20));
      style = this.clusterStyleCache[size] =
        [
          new Style({
              image: new Circle({
                  radius: radius + 2,
                  stroke: new Stroke({
                      color: 'rgba(' + color + ',0.5)',
                      width: 4
                    })
                })
            }),
          new Style({
              image: new Circle({
                  radius,
                  fill: new Fill({
                      color: 'rgba(' + color + ',0.8)'
                    })
                }),
              text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                      color: '#000'
                    })
                })
            })
        ];
    }
    return style;
  }


  /**
   * This is the bearing style. Indicating the azimuthal of the point of view
   * @param Feature a map feature representing the mapillary image point shown.
   * @returns Style[]
   */
  public mplImagePointsStyle = (feature: Feature<Point>): Style[] => {
    const rotation: number = feature.get('compass_angle') * Math.PI / 180;
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
