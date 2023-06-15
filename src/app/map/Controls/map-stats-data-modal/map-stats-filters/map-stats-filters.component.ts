import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Draw, { createBox } from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';
import { MapService } from 'src/app/map/Services/map.service';
import { StatsService } from 'src/app/map/Services/map.stats.service';
import { IndiceClass, IndexFilter, StatsIndices } from 'src/app/map/api/map.api';
import { DEFAULT_FILTER, DHM_KOINOTHTES } from 'src/app/map/api/map.datamaps';
import { StatTypes } from 'src/app/map/api/map.enums';

@Component({
  selector: 'app-map-stats-filters',
  templateUrl: './map-stats-filters.component.html',
  styleUrls: ['./map-stats-filters.component.scss']
})
export class MapStatsFiltersComponent implements OnInit {


  @Output() redrawWebGlLayer$ = new EventEmitter();

  constructor(
    public mapStatsService: StatsService,
    public mapLayersService: MapLayersService,
    public mapService: MapService) { }

  ngOnInit(): void {
  }


  public cleanRefreshWebGlLayer(): void {
    this.redrawWebGlLayer$.emit();
  }

  public isDisabled(): boolean{
    return this.mapStatsService.filters.filter(fl => !fl.sindex || fl.values.length===0).length > 0;
  }

  /**
   * Filter api
   */

  public addFilter(): void{
    this.mapStatsService.filters.push(DEFAULT_FILTER)
  }

  public removeFilter(i: number): void {
    this.mapStatsService.filters.splice(i,1);
    this.applyFilters(false);
  }

  public applyFilters(open:boolean): void{
    if (open) return;
    this.cleanRefreshWebGlLayer();
  }
  

  public getFilterClassesForIdx(idx: StatsIndices): IndiceClass[]{
    if(idx){
      return idx.type === StatTypes.class ? idx.classes : this.mapStatsService.getNumericClasses(idx);
    } else {
      return [];
    }
  }

  public getFilterCls(filter: IndexFilter): IndiceClass[]{
    return filter.classes;
  }

  public changeFilterIndex(idx: StatsIndices, i: number): void{
    this.mapStatsService.filters[i] = {
      sindex : idx,
      classes: this.getFilterClassesForIdx(idx),
      values : []
    }
  }

  public changeFilterValues(val: IndiceClass[], i: number){
    this.mapStatsService.filters[i].values = val;
  }

  public normaliseValue(sindex: StatsIndices){
    return sindex ? sindex : -1;
  }


  public setDkFilter(value: string[]): void{
    this.mapStatsService.dkFilter = value;
  }

  public applyDkFilter(open: boolean): void{
    if (open) return;
    this.applyFilters(false);
  }


  public getDhmKoin(): string[]{
    return DHM_KOINOTHTES;
  }

  public enableDraw(){
    this.mapService.drawInt.setActive(true);
    this.mapService.drawInt.on('drawend', (e1) =>{
      this.mapLayersService.DrawRectangleSelectLayer.getSource().clear();
      this.mapLayersService.DrawRectangleSelectLayer.getSource().addFeature(e1.feature);
      this.applyFilters(false);
      this.mapService.drawInt.setActive(false);
    });
  }

  public disableDraw(){
    this.mapService.drawInt.setActive(false);
    this.mapLayersService.DrawRectangleSelectLayer.getSource().clear();
    this.applyFilters(false);
  }

}
