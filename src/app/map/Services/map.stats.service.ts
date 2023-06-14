import { MapFiltersService } from './map.filters.service';
import { Injectable } from "@angular/core";
import { StatLayers, StatTypes } from "../api/map.enums";
import { IndeceClass, StatsIndeces, WebGlPointSymbol } from "../api/map.api";
import * as chroma from 'chroma-js';
import { packColor } from "ol/renderer/webgl/shaders";

@Injectable({
    providedIn: 'root'
})

export class StatsService {

    filtersResults: number[] = [];

    statsResults: any[] = [];

    constructor(private mapFiltersService: MapFiltersService) {

        // not sure if a service inside a service is a good idea though
        this.mapFiltersService.filtersResults$.subscribe((results: number[]) => {
            this.filtersResults = results;
        });

        this.mapFiltersService.statsResults$.subscribe((results: any[]) => {
            this.statsResults = results;
            console.log(this.statsResults)
        });

    }

    public selectedStatsLayer: StatLayers = StatLayers.audit_lines;
    public selectedStatsIndex: StatsIndeces;
    public numericClasses: number[][];
    public classColors: string[] = [];

    public generateClassColors(): void {
        this.classColors = this.selectedStatsIndex.type === StatTypes.number ?
            chroma.scale(['yellow', 'red']).colors(this.numericClasses.length) :
            chroma.scale(['yellow', 'red']).colors(this.selectedStatsIndex.classes.length);
    }

    public getNumericClasses(): number[][] {
        const max = this.selectedStatsIndex.max;
        const limit = Math.floor(max / (max < 5 ? max : 5));
        let min = this.selectedStatsIndex.min;
        const classes = [];
        while (min < max) {
            min = min + limit;
            classes.push([min - limit, min]);
        }
        return classes;
    }


    public getColorForLineWbgl(idx: StatsIndeces, val: number): number {
        if (this.selectedStatsIndex?.type === StatTypes.number) {
            val = val - 1;
            const classIdx = this.numericClasses?.
                findIndex((cls, i) => val >= cls[0] && ((i !== this.numericClasses.length - 1) ? (val < cls[1]) : true));
            return packColor(classIdx != -1 ? this.classColors[classIdx] : 'gray');
        } else if (this.selectedStatsIndex?.type === StatTypes.class) {
            const idxCl = idx.classes.findIndex(cls => cls.value === val);
            return packColor(this.classColors[idxCl != -1 ? idxCl : 0]);
        } else { //undefined
            return packColor('gray');
        }
    }

    public newGetColorForLineWbgl(id: any): number {
        // console.log(typeof id)
        let color = packColor('gray');
        for (let index = 0; index < this.statsResults.length; index++) {
            const element = this.statsResults[index];
            // console.log(typeof element.id)
            if (element.id == id) {
                color = element.color;
            }
        }
        return color;
    }

    // set opacity from filters
    public getOpacityForlineWbgl(featureID: number) {
        if ((this.filtersResults.length !== 0 && !this.filtersResults.includes(featureID))) {
            return 0;
        }
        else {
            return 1;
        }
    }

    // public getStyleForWebGlPointLayer(): WebGlPointSymbol {
    //     console.log(this.selectedStatsIndex)
    //     const expressions = this.selectedStatsIndex?.classes?.map((cls: IndeceClass) => {
    //         return [
    //             ['all',
    //                 ['>=', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code : ''], cls.value],
    //                 ['<', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code : ''], cls.value + 1]
    //             ],
    //             [...chroma(this.classColors[cls.value - 1]).rgb(), 1]
    //         ]
    //     }).flat();

    //     const filterExpression = this.filtersResults.map(item => {
    //         return [item.toString(), true];
    //     }).flat();


    //     return {
    //         filter: this.filtersResults.length > 0 ? [].concat(['match', ['get', 'OBJECTID']]).concat(filterExpression).concat([false]) : null,
    //         symbol: {
    //             symbolType: 'circle',
    //             size: 12,
    //             color: expressions ? [].concat('case', expressions).concat([[128, 128, 128, 1]]) : 'gray',
    //             offset: [0, 0],
    //             opacity: 0.95
    //         }
    //     };
    // }

    public getStyleForWebGlPointLayer(): WebGlPointSymbol {
        console.log(this.statsResults)
        console.log(this.selectedStatsIndex)
        // console.log(this.classColors)
        // const expressions = this.selectedStatsIndex?.classes?.map((cls: IndeceClass) => {
        //     return [
        //         ['all',
        //             ['>=', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code : ''], cls.value],
        //             ['<', ['get', this.selectedStatsIndex ? this.selectedStatsIndex.code : ''], cls.value + 1]
        //         ],
        //         [...chroma(this.classColors[cls.value - 1]).rgb(), 1]
        //     ]
        // }).flat();

        const filterExpression = this.filtersResults.map(item => {
            return [item.toString(), true];
        }).flat();

        const statsExpression = this.statsResults.map(item => {
            return [item.toString(), item.classColor];
        }).flat();


        return {
            filter: this.filtersResults.length > 0 ? [].concat(['match', ['get', 'OBJECTID']]).concat(filterExpression).concat([false]) : null,
            symbol: {
                symbolType: 'circle',
                size: 12,
                color: this.statsResults.length > 0 ? [].concat(['match', ['get', 'OBJECTID']]).concat(statsExpression).concat(['gray']) : 'gray',
                // color: (feature: any) => {console.log(feature);
                //     if (feature) {
                //         console.log(feature.get('OBJECTID')); for (let index = 0; index < this.statsResults.length; index++) {
                //             const element = this.statsResults[index];
                //             // console.log(typeof element.id)

                //             if (element.id == feature.get('OBJECTID')) {
                //                 return element.classColor;
                //             }
                //             else {
                //                 return 'gray';
                //             }
                //         }
                //     } else {
                //         return 'gray';
                //     }
                // },
                offset: [0, 0],
                opacity: 0.95
            }
        };
    }

}