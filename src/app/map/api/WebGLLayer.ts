import Layer, { Options } from 'ol/layer/Layer.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import { FeatureLike } from 'ol/Feature';
import Source from 'ol/source/Source';
import { StatsService } from '../Services/map.stats.service';
import { packColor } from 'ol/renderer/webgl/shaders';


export class WebGLLayer extends Layer {
  private mapStatsService : StatsService;

  constructor(private mapStsService: StatsService, private opt: Options<Source>){
    super(opt);
    this.mapStatsService = mapStsService;
  }

//   override createRenderer(): WebGLVectorLayerRenderer {
//     return new WebGLVectorLayerRenderer(this, {
//       fill: {
//         attributes: {
//           color: (f: FeatureLike) =>{
//             const color = '#ff0000';
//             return color;
//           },
//           opacity: (f: FeatureLike) => {
//             return 0.6;
//           },
//         },
//       },
//       stroke: {
//         attributes: {
//           color: (feature: FeatureLike) => {
//             return feature.get(this.mapStatsService.selectedStatsIndex?.code) ? this.mapStatsService.getColorForLineWbgl(
//               // to filter features' style by objectid
//               this.mapStatsService.selectedStatsIndex,
//               feature.get(this.mapStatsService.selectedStatsIndex?.code)
//               ) : packColor('gray'); //just gray for no data 
//           },
//           width:  (f: FeatureLike) => {
//             return 1.5;
//           },
//           opacity:  (f: FeatureLike) => {
//             // we may place a method here to use for filtering
//             return this.mapStatsService.getOpacityForlineWbgl(parseInt(f.get('OBJECTID'))) ;
//           },
//         },
//       },
//     });
//   }
// }

override createRenderer(): WebGLVectorLayerRenderer {
  return new WebGLVectorLayerRenderer(this, {
    fill: {
      attributes: {
        color: (f: FeatureLike) =>{
          const color = '#ff0000';
          return color;
        },
        opacity: (f: FeatureLike) => {
          return 0.6;
        },
      },
    },
    stroke: {
      attributes: {
        color: (feature: FeatureLike) => {
          return this.mapStatsService.newGetColorForLineWbgl(feature.get('OBJECTID')); 
        },
        width:  (f: FeatureLike) => {
          return 1.5;
        },
        opacity:  (f: FeatureLike) => {
          // we may place a method here to use for filtering
          return this.mapStatsService.getOpacityForlineWbgl(parseInt(f.get('OBJECTID'))) ;
        },
      },
    },
  });
}
}