import { MapFiltersService } from './../../Services/map.filters.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StatLayers, StatTypes } from '../../api/map.enums';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import * as chroma from 'chroma-js';
import { packColor } from 'ol/renderer/webgl/shaders';
import { MapLayersService } from '../../Services/map.layers.service';
import { MapService } from '../../Services/map.service';
import { StatsService } from '../../Services/map.stats.service';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';
import { Draw } from 'ol/interaction';

@Component({
  selector: 'app-map-stats-data-filters',
  templateUrl: './map-stats-data-filters.component.html',
  styleUrls: ['./map-stats-data-filters.component.scss']
})
export class MapStatsDataFiltersComponent implements OnInit {

  @ViewChild('selectedValuesA') selectedValuesA: MatSelect;
  @ViewChild('selectedValuesB') selectedValuesB: MatSelect;
  @ViewChild('selectedValuesC') selectedValuesC: MatSelect;

  layers: any[] = [
    { id: 1, name: 'Γραμμές πεζοδρομίων' },
    { id: 2, name: 'Στάσεις Λεωφορείων' },
  ]

  auditLinesfilters: any[] = [];
  auditLinesValues: any[] = [];

  busStopsfilters: any[] = [];
  busStopsValues: any[] = [];

  selectedLayer: number = 1;


  stats: any[] = this.auditLinesfilters;

  filtersA: any[] = this.auditLinesfilters;
  filtersB: any[] = [];
  filtersC: any[] = [];


  filterValuesA: any[] = [];
  filterValuesB: any[] = [];
  filterValuesC: any[] = [];

  selectedStat: any;

  selectedFilterA: any;
  selectedFilterB: any;
  selectedFilterC: any;

  selectedFilterValuesA: any[] = [];
  selectedFilterValuesB: any[] = [];
  selectedFilterValuesC: any[] = [];

  allSelectedA: boolean = false;
  allSelectedB: boolean = false;
  allSelectedC: boolean = false;

  allData: number = 0;
  filteredData: number = 0;
  filteredDataPer: string = '0';

  numericClasses: number[][];
  classes: string[];
  classColors: string[] = [];

  statType: number = 1;

  filterSource = new VectorSource();
  filterVector = new VectorLayer({
    className: "filterLayer",
    source: this.filterSource,
    // style: new Style({
    //   stroke: new Stroke({
    //     color: "#ff4081",
    //     width: 2
    //   })
    // }),
    zIndex: 20
  });

  filterDraw = new Draw({
    source: this.filterSource,
    type: "Polygon"
  });

  constructor(private httpClient: HttpClient, private mapFiltersService: MapFiltersService, private mapService: MapService,
    private mapLayersService: MapLayersService, private mapStatsService: StatsService) {

    // this.mapFiltersService.currentLayer$.subscribe((layer: string) => {
    //   console.log(layer)
    //   this.selectedLayer = layer;
    //   switch (layer) {
    //     case "Γραμμές πεζοδρομίων":
    //       this.filtersA = this.auditLinesfilters;
    //       this.filterValuesA = [];
    //       break;
    //     case "Στάσεις Λεωφορείων":
    //       this.filtersA = this.busStopsfilters;
    //       this.filterValuesA = [];
    //       break;
    //     default:
    //       break;
    //   }
    // });

  }

  ngOnInit(): void {


    this.httpClient.get('assets/map_data/audit_lines.csv', { responseType: 'text' }).subscribe(data => {
      const rows = data.split("\n");
      const headers = rows[0].split(';');
      let auditLinesRaw = [];
      for (let index = 1; index < headers.length; index++) {
        const element = headers[index];
        const obj = {
          id: index - 1,
          name: element
        }
        auditLinesRaw.push(obj);
        // if (element.startsWith('Ποιος είναι ο κύριος τρόπος μετακίνησής σας') || element.startsWith('Φύλο') || element.startsWith('Σε ποιο Δημοτικό Διαμέρισμα')) {
        //   this.filterVariables_students.push(element);
        // }
      }
      for (let index = 1; index < rows.length - 1; index++) {
        const element = rows[index];
        const value: any = {};
        const properties = element.split(';')
        for (let j in headers) {
          value[headers[j]] = properties[j]
        }
        this.auditLinesValues.push(value);
      }

      this.auditLinesfilters = auditLinesRaw.filter((obj) => {
        if (obj.id !== 0 && obj.id !== 1) {
          return obj;
        }
        else {
          return null;
        }
      });

      this.filtersA = this.auditLinesfilters;
      this.stats = this.auditLinesfilters;
      console.log(this.auditLinesfilters)
      console.log(this.auditLinesValues)
      this.allData = this.auditLinesValues.length;
      // this.filterResponses()
    });

    this.httpClient.get('assets/map_data/bus_stops.csv', { responseType: 'text' }).subscribe(data => {
      const rows = data.split("\n");
      const headers = rows[0].split(';');
      let busStopsRaw = [];
      for (let index = 1; index < headers.length; index++) {
        const element = headers[index];
        const obj = {
          id: index - 1,
          name: element
        }
        busStopsRaw.push(obj);
        this.busStopsfilters = busStopsRaw.filter((obj) => {
          if (obj.id !== 0 && obj.id !== 1 && obj.id !== 2 && obj.id !== 3) {
            return obj;
          }
          else {
            return null;
          }
        });
      }
      for (let index = 1; index < rows.length - 1; index++) {
        const element = rows[index];
        const value: any = {};
        const properties = element.split(';')
        for (let j in headers) {
          value[headers[j]] = properties[j]
        }
        this.busStopsValues.push(value);
      }
      this.auditLinesfilters.filter((obj) => {
        if (obj.id !== 0 && obj.id !== 1) {
          return obj;
        }
      });
      console.log(this.busStopsfilters)
      console.log(this.busStopsValues)
      this.allData = this.busStopsValues.length;
      // this.filterResponses()
    });

    this.mapService.smartCityMap.addLayer(this.filterVector);

  }

  selectLayer(e: any) {
    console.log(e)
    this.selectedLayer = e;
    switch (this.selectedLayer) {
      case 1:
        this.stats = this.auditLinesfilters;
        this.filtersA = this.auditLinesfilters;
        this.filterValuesA = [];
        this.mapStatsService.selectedStatsLayer = StatLayers.audit_lines;
        this.cleanRefreshWebGlLayer();
        break;
      case 2:
        this.stats = this.busStopsfilters;
        this.filtersA = this.busStopsfilters;
        this.filterValuesA = [];
        this.mapStatsService.selectedStatsLayer = StatLayers.bus_stops;
        this.cleanRefreshWebGlLayer();
        break;
      default:
        break;
    }
  }

  selectStat(e: any) {
    console.log(e)
    const statValues = [];
    const statObjets = [];
    this.statType = 1;
    let rawValues: any[] = [];
    switch (this.selectedLayer) {
      case 1:
        rawValues = this.auditLinesValues;
        break;
      case 2:
        rawValues = this.busStopsValues;
        break;
      default:
        break;
    }
    // console.log(isNaN(this.auditLinesValues[0][e.name]))
    for (let index = 0; index < rawValues.length; index++) {
      const element = rawValues[index];
      if (isNaN(element[e.name])) {
        this.statType = 2;
      }
      else {
        this.statType = 1;
      }
      if (element[e.name]) {
        statValues.push(element[e.name]);
      }
    }
    // console.log(statValues)
    const uniquevalues = [... new Set(statValues)]
    console.log(uniquevalues)

    if (this.statType === 1) {
      this.numericClasses = this.getNumericClasses(uniquevalues);
    }
    else {
      this.classes = uniquevalues;
    }

    this.generateClassColors(this.statType);

    const statValuesForstyle = [];
    for (let index = 0; index < rawValues.length; index++) {
      const element = rawValues[index];
      let obj = { id: parseInt(element['OBJECTID']), color: this.getColorForLineWbgl(element[e.name]), classColor: this.getColorForPointWbgl(element[e.name]) };
      statValuesForstyle.push(obj);
    }

    console.log(statValuesForstyle)

    this.mapFiltersService.announceStatsResults(statValuesForstyle);
    this.cleanRefreshWebGlLayer();
  }

  generateClassColors(type: number): void {
    this.classColors = type === 1 ?
      chroma.scale(['yellow', 'red']).colors(this.numericClasses.length) :
      chroma.scale(['yellow', 'red']).colors(this.classes.length);
  }

  getNumericClasses(array: number[]): number[][] {
    const max = Math.max(...array);
    const limit = Math.floor(max / (max < 5 ? max : 5));
    let min = Math.min(...array);
    const classes = [];
    while (min < max) {
      min = min + limit;
      classes.push([min - limit, min]);
    }
    return classes;
  }

  getColorForLineWbgl(val: number): number {
    if (this.statType === 1) {
      // val = val - 1;
      const classIdx = this.numericClasses?.
        findIndex((cls, i) => val >= cls[0] && ((i !== this.numericClasses.length - 1) ? (val < cls[1]) : true));
      return packColor(classIdx != -1 ? this.classColors[classIdx] : 'gray');
    } else if (this.statType === 2) {
      const idxCl = this.classes.findIndex((cls: any) => cls.value === val);
      return packColor(this.classColors[idxCl != -1 ? idxCl : 0]);
    } else { //undefined
      return packColor('gray');
    }
  }

  getColorForPointWbgl(val: string): any {
    if (this.statType === 2) {
      // console.log(this.classes)
      for (let index = 0; index < this.classes.length; index++) {
        const element = this.classes[index];
        if (element === val) {
          return this.classColors[index];
        }
        else {
          return 'gray';
        }
      }
      // val = val - 1;
      //   const classIdx = this.classes?.
      //     findIndex((cls, i) => val === cls ));
      //   return packColor(classIdx != -1 ? this.classColors[classIdx] : 'gray');
      // } else if (this.statType === 2) {
      //   const idxCl = this.classes.findIndex((cls: any) => cls.value === val);
      //   return packColor(this.classColors[idxCl != -1 ? idxCl : 0]);
      // } else { //undefined
      // return packColor('gray');
    }
  }

  selectAllValuesA() {
    if (this.allSelectedA) {
      this.selectedValuesA.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectedValuesA.options.forEach((item: MatOption) => item.deselect());
    }
  }

  selectAllValuesB() {
    if (this.allSelectedB) {
      this.selectedValuesB.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectedValuesB.options.forEach((item: MatOption) => item.deselect());
    }
  }

  selectAllValuesC() {
    if (this.allSelectedC) {
      this.selectedValuesC.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectedValuesC.options.forEach((item: MatOption) => item.deselect());
    }
  }

  filterASelect(e: any) {
    console.log(e)
    switch (this.selectedLayer) {
      case 1:
        this.filterValuesA = [];
        this.filtersB = [];
        this.filterValuesB = [];
        this.filtersC = [];
        this.filterValuesC = [];
        for (let index = 0; index < this.auditLinesValues.length; index++) {
          const element = this.auditLinesValues[index];
          if (!this.filterValuesA.includes(element[e.name]) && element[e.name] !== null && element[e.name] !== '') {
            this.filterValuesA.push(element[e.name]);
          }

        }

        this.filterValuesA.sort();

        this.filtersB = this.filtersA.filter(obj => {
          if (obj.id !== e.id) {
            return obj;
          } else {
            return null;
          }
        })

        break;
      case 2:
        this.filterValuesA = [];
        this.filtersB = [];
        this.filterValuesB = [];
        this.filtersC = [];
        this.filterValuesC = [];
        for (let index = 0; index < this.busStopsValues.length; index++) {
          const element = this.busStopsValues[index];
          if (!this.filterValuesA.includes(element[e.name]) && element[e.name] !== null && element[e.name] !== '') {
            this.filterValuesA.push(element[e.name]);
          }
        }
        this.filterValuesA.sort();
        this.filtersB = this.filtersA.filter(obj => {
          if (obj.id !== e.id) {
            return obj;
          } else {
            return null;
          }
        })
        break;
      default:
        break;
    }
  }

  filterBSelect(e: any) {
    console.log(e)
    switch (this.selectedLayer) {
      case 1:
        this.filterValuesB = [];
        this.filtersC = [];
        this.filterValuesC = [];
        for (let index = 0; index < this.auditLinesValues.length; index++) {
          const element = this.auditLinesValues[index];
          if (!this.filterValuesB.includes(element[e.name]) && element[e.name] !== null && element[e.name] !== '') {
            this.filterValuesB.push(element[e.name]);
          }

        }
        this.filterValuesB.sort();
        this.filtersC = this.filtersB.filter(obj => {
          if (obj.id !== e.id) {
            return obj;
          } else {
            return null;
          }
        })
        break;
      case 2:
        this.filterValuesB = [];
        this.filtersC = [];
        this.filterValuesC = [];
        for (let index = 0; index < this.busStopsValues.length; index++) {
          const element = this.busStopsValues[index];
          if (!this.filterValuesB.includes(element[e.name]) && element[e.name] !== null && element[e.name] !== '') {
            this.filterValuesB.push(element[e.name]);
          }
        }
        this.filterValuesB.sort();
        this.filtersC = this.filtersB.filter(obj => {
          if (obj.id !== e.id) {
            return obj;
          } else {
            return null;
          }
        })
        break;
      default:
        break;
    }
  }

  filterCSelect(e: any) {
    console.log(e)
    switch (this.selectedLayer) {
      case 1:
        this.filterValuesC = [];
        for (let index = 0; index < this.auditLinesValues.length; index++) {
          const element = this.auditLinesValues[index];
          if (!this.filterValuesC.includes(element[e.name]) && element[e.name] !== null && element[e.name] !== '') {
            this.filterValuesC.push(element[e.name]);
          }

        }

        this.filterValuesC.sort();

        break;
      case 2:
        this.filterValuesC = [];
        for (let index = 0; index < this.busStopsValues.length; index++) {
          const element = this.busStopsValues[index];
          if (!this.filterValuesC.includes(element[e.name]) && element[e.name] !== null && element[e.name] !== '') {
            this.filterValuesC.push(element[e.name]);
          }
        }
        this.filterValuesC.sort();
        break;
      default:
        break;
    }
  }

  filterASelectValues(e: any) {
    console.log(e)
  }

  clearFilters() {
    this.selectedFilterA = null;
    this.selectedFilterB = null;
    this.selectedFilterC = null;
    this.selectedFilterValuesA = [];
    this.selectedFilterValuesB = [];
    this.selectedFilterValuesC = [];
    this.mapFiltersService.announceFiltersResults([]);
    this.cleanRefreshWebGlLayer();
    this.filteredData = 0;
    this.filteredDataPer = ((this.filteredData / this.allData) * 100).toFixed(1);
  }

  applyFilters() {
    let results: number[] = [];
    const spatialFiltered: number[] = [];
    this.mapService.smartCityMap.removeInteraction(this.filterDraw);
    if (this.filterSource.getFeatures().length > 0) {

      for (let webGLIndex = 0; webGLIndex < this.mapLayersService.webGlStatsSource.getFeatures().length; webGLIndex++) {
        const webGLElement = this.mapLayersService.webGlStatsSource.getFeatures()[webGLIndex];

        for (let index = 0; index < this.filterSource.getFeatures().length; index++) {
          const element = this.filterSource.getFeatures()[index];

          if (element.getGeometry().intersectsCoordinate(webGLElement.getGeometry().getExtent())) {
            spatialFiltered.push(webGLElement.get('OBJECTID'))
          }
        }
      }


    }

    console.log(spatialFiltered)

    if (this.selectedFilterA) {


      switch (this.selectedLayer) {
        case 1:



          for (let index = 0; index < this.auditLinesValues.length; index++) {
            const element = this.auditLinesValues[index];
            if (this.selectedFilterValuesA.includes(element[this.selectedFilterA.name]) &&
              (this.selectedFilterValuesB.length === 0 || this.selectedFilterValuesB.includes(element[this.selectedFilterB.name])) &&
              (this.selectedFilterValuesC.length === 0 || this.selectedFilterValuesC.includes(element[this.selectedFilterC.name])) &&
              (this.filterSource.getFeatures().length === 0 || spatialFiltered.includes(parseInt(element['OBJECTID'])))
            ) {
              results.push(parseInt(element['OBJECTID']));
            }
          }
          console.log(results);
          this.mapFiltersService.announceFiltersResults(results);
          this.cleanRefreshWebGlLayer();
          this.filteredData = results.length;
          this.filteredDataPer = ((this.filteredData / this.allData) * 100).toFixed(1);
          break;
        case 2:

          for (let index = 0; index < this.busStopsValues.length; index++) {
            const element = this.busStopsValues[index];
            if (this.selectedFilterValuesA.includes(element[this.selectedFilterA.name]) &&
              (this.selectedFilterValuesB.length === 0 || this.selectedFilterValuesB.includes(element[this.selectedFilterB.name])) &&
              (this.selectedFilterValuesC.length === 0 || this.selectedFilterValuesC.includes(element[this.selectedFilterC.name])) &&
              (this.filterSource.getFeatures().length === 0 || spatialFiltered.includes(element['OBJECTID']))
            ) {
              results.push(element['OBJECTID']);
            }
          }
          console.log(results);
          this.mapFiltersService.announceFiltersResults(results);
          this.cleanRefreshWebGlLayer();
          this.filteredData = results.length;
          this.filteredDataPer = ((this.filteredData / this.allData) * 100).toFixed(1);
          break;
        default:
          break;
      }

    }
    else {
      results = spatialFiltered;
      this.mapFiltersService.announceFiltersResults(results);
      this.cleanRefreshWebGlLayer();
      this.filteredData = results.length;
      this.filteredDataPer = ((this.filteredData / this.allData) * 100).toFixed(1);
    }
  }

  private cleanRefreshWebGlLayer(): void {
    this.mapService.smartCityMap.removeLayer(this.mapLayersService.WebGlStatsLayer);
    this.mapLayersService.WebGlStatsLayer.dispose();
    this.mapLayersService.initWebGlStatsLayer(true);
    this.mapService.smartCityMap.addLayer(this.mapLayersService.WebGlStatsLayer);
  }

  draw() {
    this.mapService.smartCityMap.removeInteraction(this.filterDraw);
    this.filterSource.clear();
    this.mapService.smartCityMap.addInteraction(this.filterDraw);
  }

  clearSpatial() {
    this.mapService.smartCityMap.removeInteraction(this.filterDraw);
    this.filterSource.clear();
  }

}
