import { Injectable } from "@angular/core";
import { StatLayers, StatTypes } from "../api/map.enums";
import { IndeceClass, StatsIndeces, WebGlPointSymbol } from "../api/map.api";
import * as chroma from 'chroma-js';
import { packColor } from "ol/renderer/webgl/shaders";

@Injectable({
    providedIn: 'root'
  })
  
  export class StatsService {

    constructor(){

    }

    public selectedStatsLayer: StatLayers = StatLayers.audit_lines;
    public selectedStatsIndex: StatsIndeces;
    public numericClasses: number[][];
    public classColors: string[] = [];

    public generateClassColors(): void{
        this.classColors = this.selectedStatsIndex.type === StatTypes.number ? 
        chroma.scale(['yellow', 'red']).colors(this.numericClasses.length) :
        chroma.scale(['yellow', 'red']).colors(this.selectedStatsIndex.classes.length);
    }

    public getNumericClasses() : number[][] {
        const max = this.selectedStatsIndex.max;
        const limit = Math.floor(max/(max < 5 ? max : 5));
        let min = this.selectedStatsIndex.min;
        const classes = [];
        while (min < max) {
            min = min + limit;
            classes.push([min-limit , min]);
        }
        return classes;
      }


    public getColorForLineWbgl(idx: StatsIndeces, val: number): number{
        // val = val-1;
        if (this.selectedStatsIndex?.type === StatTypes.number){
            val = val-1;
            const classIdx = this.numericClasses?.
            findIndex((cls,i) => val >= cls[0] && ((i !== this.numericClasses.length-1) ? (val < cls[1]) : true));
            return packColor(classIdx != -1 ? this.classColors[classIdx] : 'gray');
        } else if (this.selectedStatsIndex?.type === StatTypes.class){
            const idxCl = idx.classes.findIndex(cls => cls.value === val);
            return packColor(this.classColors[idxCl != -1 ? idxCl : 0]);
        } else { //undefined
            return packColor('gray');
        }
      }

      public getStyleForWebGlPointLayer(): WebGlPointSymbol{
        const expressions = this.selectedStatsIndex?.classes?.map((cls: IndeceClass) => {
            return [
                ['all', 
                    ['>=', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code: ''], cls.value],
                    ['<', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code: ''], cls.value+1]
                ],
                [...chroma(this.classColors[cls.value-1]).rgb(), 1]
            ]
        }).flat();
        
        return {
            symbol: {
                symbolType: 'circle',
                size: 12,
                color : expressions ? [].concat('case', expressions).concat([[128,128,128, 1]]) : 'gray',
                offset: [0, 0],
                opacity: 0.95,
            }
        };
      }

  }