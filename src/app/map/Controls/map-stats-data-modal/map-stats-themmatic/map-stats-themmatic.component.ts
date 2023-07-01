import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';
import { MapService } from 'src/app/map/Services/map.service';
import { StatsService } from 'src/app/map/Services/map.stats.service';
import { StatsIndices } from 'src/app/map/api/map.api';
import { DEFAULT_FILTER, STATS_INDECES } from 'src/app/map/api/map.datamaps';
import { StatLayers, StatTypes } from 'src/app/map/api/map.enums';
import { AppMessagesService } from 'src/app/shared/messages.service';

@Component({
  selector: 'app-map-stats-themmatic',
  templateUrl: './map-stats-themmatic.component.html',
  styleUrls: ['./map-stats-themmatic.component.scss']
})
export class MapStatsThemmaticComponent implements OnInit {

  public statTypeNum = StatTypes.number;
  public statTypeClass = StatTypes.class;


  @Output() redrawWebGlLayer$ = new EventEmitter();
  
  constructor(
    public mapStatsService: StatsService,
    public mapLayersService: MapLayersService,
    private mapMessagesService : AppMessagesService, 
    public mapService: MapService) { }

  ngOnInit(): void {
  }

  public getStatLayerTypes(): string[]{
    return Object.values(StatLayers);
  }
  
  public cleanRefreshWebGlLayer(): void {
    this.redrawWebGlLayer$.emit();
  }

  
  public setActiveLayer(val: StatLayers): void{
    this.mapStatsService.selectedStatsLayer = val;
    this.mapStatsService.numericClasses = [];
    this.mapStatsService.classColors = [];
    this.mapStatsService.filters = [DEFAULT_FILTER];
    this.mapStatsService.selectedStatsIndex = null;
    this.mapStatsService.countAll =0;
    this.mapStatsService.countFiltered = 0;
    this.cleanRefreshWebGlLayer();
  }

  public setIndice(idx: StatsIndices): void{
    this.mapStatsService.selectedStatsIndex = idx;
    this.mapMessagesService.showMapMessage({
      message:  this.mapStatsService.selectedStatsIndex.label,
      action: '✖',
      duration: 30000, 
      hPosition: 'center', 
      vPosition: 'bottom',
      styleClass: 'map-snackbar'
    });
    this.mapStatsService.numericClasses = this.mapStatsService.selectedStatsIndex.type === StatTypes.number ?
    this.mapStatsService.getNumericClasses(this.mapStatsService.selectedStatsIndex) : 
    [];

    this.mapStatsService.generateClassColors();
    
    this.cleanRefreshWebGlLayer();
  }


  public setColorForClass(i: number){
    this.cleanRefreshWebGlLayer();
  }


  
}
