import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';
import { MapService } from 'src/app/map/Services/map.service';
import { StatsService } from 'src/app/map/Services/map.stats.service';
import { IndiceClass, IndexFilter, StatsIndices } from 'src/app/map/api/map.api';
import { DEFAULT_FILTER, DHM_GEITONIES, DHM_KOINOTHTES } from 'src/app/map/api/map.datamaps';
import { StatTypes } from 'src/app/map/api/map.enums';
import { TranslatePipe } from 'src/app/shared/translate/translate.pipe';
import { TranslateService } from 'src/app/shared/translate/translate.service';

@Component({
  selector: 'app-map-stats-filters',
  templateUrl: './map-stats-filters.component.html',
  styleUrls: ['./map-stats-filters.component.scss']
})
export class MapStatsFiltersComponent implements OnInit {


  @Output() redrawWebGlLayer$ = new EventEmitter();
  private translatePipe: TranslatePipe;
  public spatialUnitOptions: {id:number, value:string}[];
  public selectedUnit:{id:number, value:string};
  public adminAreaNames: string[];
  public filtersForm: FormGroup;

  constructor(
    public mapStatsService: StatsService,
    public mapLayersService: MapLayersService,
    private translateService: TranslateService,
    public mapService: MapService) { 

      this.translatePipe = new TranslatePipe(this.translateService);
      this.spatialUnitOptions = [
        {id:1, value: this.translatePipe.transform('MAP.STATS-DHMKOIN-FILTER')}, 
        {id:2, value: this.translatePipe.transform('MAP.STATS-GEITONIES-FILTER')}
      ];

    }

  public ngOnInit(): void {
    this.selectedUnit = this.spatialUnitOptions.find(su=> su.id === this.mapStatsService.spatialAdminType?.id);
    this.adminAreaNames = this.selectedUnit?.id === 1 ? DHM_KOINOTHTES : this.selectedUnit?.id === 2 ? DHM_GEITONIES : [];
    this.filtersForm = new FormGroup({
      spatialUnitSelector: new FormControl(this.selectedUnit),
      spatialAdminSelector: new FormControl(this.mapStatsService.dkFilter)
    });

  }

  public cleanRefreshWebGlLayer(): void {
    this.redrawWebGlLayer$.emit();
  }

  public isDisabled(): boolean{
    return this.mapStatsService.filters.filter(fl => !fl.sindex || fl.values.length===0).length > 0;
  }

  public toggleHeat(val: boolean){
    this.mapStatsService.heatEnable = val;
    if (val) {
      this.addHeatMap();
    } else {
      this.removeHeatMap();
    }
  }

  private removeHeatMap(){
    if (this.mapLayersService.HeatMapLayer){
      this.mapService.smartCityMap.removeLayer(this.mapLayersService.HeatMapLayer);
      this.mapLayersService.HeatMapLayer.dispose();
    }
  }

  private addHeatMap(){
    this.mapLayersService.initHeatmapLayer(true);
    this.mapService.smartCityMap.addLayer(this.mapLayersService.HeatMapLayer);
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

  public enableDraw(): void{
    this.mapService.drawInt.setActive(true);
    this.mapService.drawInt.on('drawend', (e1) =>{
      this.mapLayersService.DrawRectangleSelectLayer.getSource().clear();
      this.mapLayersService.DrawRectangleSelectLayer.getSource().addFeature(e1.feature);
      this.applyFilters(false);
      this.mapService.drawInt.setActive(false);
    });
  }

  public disableDraw(): void{
    this.mapService.drawInt.setActive(false);
    this.mapLayersService.DrawRectangleSelectLayer.getSource().clear();
    this.applyFilters(false);
  }

  public isExisted(idx: StatsIndices): boolean{
   return this.mapStatsService.filters.map(fl => fl.sindex?.code).includes(idx.code);
  }

  public clearAllFilters(): void{
    this.mapStatsService.filters = [];
    this.mapStatsService.dkFilter = [];
    this.filtersForm.controls['spatialAdminSelector'].setValue(null);
    this.disableDraw();
  }



  public setOptionsForType(type: {id:number, value:string}){ 
    this.mapStatsService.spatialAdminType = type;
    this.adminAreaNames = type.id === 1 ? DHM_KOINOTHTES : DHM_GEITONIES;
    if (this.mapStatsService.dkFilter.length > 0){
      this.mapStatsService.dkFilter = [];
      this.applyFilters(false);
    }
    
    
  }
}
