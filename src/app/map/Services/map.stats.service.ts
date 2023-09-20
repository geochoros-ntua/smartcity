import { Injectable } from "@angular/core";
import { StatLayers, StatTypes } from "../api/map.enums";
import { IndiceClass, IndexFilter, StatsIndices, WebGlPointSymbol } from "../api/map.api";
import * as chroma from 'chroma-js';
import { packColor } from "ol/renderer/webgl/shaders";
import { FeatureLike } from "ol/Feature";
import { DEFAULT_FILTER, STATS_INDECES } from "../api/map.datamaps";
import { MatDialogRef } from "@angular/material/dialog";
import { MapStatsDataModalComponent } from "../Controls/map-stats-data-modal/map-stats-data-modal.component";

@Injectable({
    providedIn: 'root'
  })
  
  export class StatsService {


    public selectedStatsLayer: StatLayers = StatLayers.audit_lines;
    public selectedStatsIndex: StatsIndices;
    public numericClasses: IndiceClass[];
    public classColors: string[] = [];

    public filters: IndexFilter[] = [DEFAULT_FILTER];
    public dkFilter: string[] = [];
    public spatialAdminType:{id:number, value:string}
    public statDialogRef: MatDialogRef<MapStatsDataModalComponent, any>;

    public countFiltered: number = 0;
    public countAll: number = 0;

    public heatEnable: boolean = false;
    

    constructor(){}

    public getIndecesForLayer(lyr: StatLayers): StatsIndices[]{
        return STATS_INDECES.filter(idc => idc.layer === lyr)
    }


    public getLayerFormIndex(idx: string): StatLayers{
        return STATS_INDECES.find(idc => idc.code === idx).layer
    }

    


    
    public generateClassColors(): void{
        this.classColors = this.selectedStatsIndex.type === StatTypes.number ? 
        chroma.scale(['yellow', 'red']).colors(this.numericClasses.length) :
        chroma.scale(['yellow', 'red']).colors(this.selectedStatsIndex.classes.length);
    }


    public getNumericClasses(statIndex: StatsIndices) : IndiceClass[] {
        if (statIndex){
        const max = statIndex.max;
        const limit = Math.floor(max/(max < 5 ? max : 5));
        let min = statIndex.min;
        const classes:IndiceClass[] = [];
        while (min < max) {
            min = min + limit;
            classes.push({
                label: (min -limit) + " - " + min,
                min: min -limit,
                max: min,
                counter: 0
            });
        }
        return classes;
        } else {
            return [];
        }
    }

    public getColorForLineWbgl(idx: StatsIndices, val: number): number{
        if (this.selectedStatsIndex?.type === StatTypes.number){
            const classIdx = this.numericClasses?.findIndex((cls,i) => 
                val >= cls.min && ((i !== this.numericClasses.length-1) ? (val -1 < cls.max) : true)
            );
            return packColor(classIdx != -1 ? this.classColors[classIdx] : 'gray');
        } else if (this.selectedStatsIndex?.type === StatTypes.class){
            const idxCl = idx.classes.findIndex(cls => cls.value === val);
            return packColor(this.classColors[idxCl != -1 ? idxCl : 0]);
        } else { //undefined
            return packColor('gray');
        }
      }

      public getStyleForWebGlPointLayer(): WebGlPointSymbol{
        // style expressions
        const colorExpressions = this.selectedStatsIndex?.classes?.map((cls: IndiceClass) => {
            return [
                ['all', 
                    ['>=', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code: ''], cls.value],
                    ['<', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code: ''], cls.value+1]
                ],
                [...chroma(this.classColors[cls.value-1]).rgb(), 1]
            ]
        }).flat();
        // filter expressions
        const filterExpressions = this.filters
        .filter(fl => fl.sindex && fl.values.length>0)
        .map (fl => {
            return fl.values.length === 1 ? 
            ['==', ['get', fl.sindex.code], fl.values[0].value] : 
            ['any', ...fl.values.map(item => ['==', ['get', fl.sindex.code], item.value])];    
        });
        // dk filter expressions
        const dkFilterExpressions = this.dkFilter.length === 0 ?
        [] :  this.dkFilter.length === 1 ? ['==', ['get', this.spatialAdminType.id === 1 ? 'dk_name' : 'geitonia'], this.dkFilter[0]] :
        ['any', ...this.dkFilter.map(item => ['==', ['get', this.spatialAdminType.id === 1 ? 'dk_name' : 'geitonia'], item])];  
        // all filter expressions
        const allFilterExpressions = dkFilterExpressions.length === 0 ?  [...filterExpressions] : [...filterExpressions, dkFilterExpressions];

        // the webgl symbol
        return {
            filter: allFilterExpressions.length === 0 ? null : allFilterExpressions.length === 1 ? allFilterExpressions[0] : ['all',...allFilterExpressions],
            symbol: {
                symbolType: 'circle',
                size: 12,
                color : colorExpressions ? [].concat('case', colorExpressions).concat([[128,128,128, 1]]) : 'gray',
                offset: [0, 0],
                opacity: 0.95,
            }
        };
      }


      //  for webgllines
      public getFeatureVisiblity(f: FeatureLike): number{
        const filterResults = this.filters
        .filter(fl => fl.sindex && fl.values.length>0)
        .map(fl => {
            let featVal = f.get(fl.sindex.code);
            if (fl.sindex.type === StatTypes.class){
               return fl.values.map(itm=> itm.value).includes(featVal);
            } else {
                featVal = featVal === 0 ? featVal : featVal -1;
                const conditionsArray = fl.values.map(item => {
                    return featVal >= item.min && featVal < item.max;
                })
                return conditionsArray.includes(true);
            }

        });
        const dkFilterResult = this.dkFilter.length > 0 ? this.dkFilter.includes(this.spatialAdminType.id === 1 ? f.get("dk_name") : f.get("geitonia")) : true;
        return [...filterResults, dkFilterResult].includes(false) ? 0 : 1;
    }


  }