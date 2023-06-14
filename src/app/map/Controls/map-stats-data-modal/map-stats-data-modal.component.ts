import { MapFiltersService } from './../../Services/map.filters.service';
import { Component, OnInit } from '@angular/core';
import { StatLayers, StatTypes } from '../../api/map.enums';
import { MapLayersService } from '../../Services/map.layers.service';
import { STATS_INDECES } from '../../api/map.datamaps';
import { StatsIndeces } from '../../api/map.api';
import { AppMessagesService } from 'src/app/shared/messages.service';
import { StatsService } from '../../Services/map.stats.service';
import { MapService } from '../../Services/map.service';

@Component({
  selector: 'app-map-stats-data-modal',
  templateUrl: './map-stats-data-modal.component.html',
  styleUrls: ['./map-stats-data-modal.component.scss']
})
export class MapStatsDataModalComponent implements OnInit {

  public statTypeNum = StatTypes.number;
  public statTypeClass = StatTypes.class;
  constructor(
    public mapService: MapService,
    public mapStatsService: StatsService,
    public mapLayersService: MapLayersService,
    private mapMessagesService: AppMessagesService,
    private mapFiltersService: MapFiltersService) {

    // reapply the webgl style when filter results
    this.mapFiltersService.filtersResults$.subscribe(results => {
      if (results) {
        this.cleanRefreshWebGlLayer();
      }
    });
    // can be moved to filters component same for the above
    this.mapFiltersService.statsResults$.subscribe(results => {
      if (results) {
        console.log(results)
        this.cleanRefreshWebGlLayer();
      }
    });
  }

  ngOnInit(): void {
  }

  public getStatLayerTypes(): string[] {
    return Object.values(StatLayers);
  }

  public setActiveLayer(val: StatLayers): void {
    this.mapStatsService.selectedStatsLayer = val;
    this.mapStatsService.numericClasses = [];
    this.mapStatsService.classColors = [];
    this.mapStatsService.selectedStatsIndex = null;
    this.cleanRefreshWebGlLayer();

    // set the current layer for the filters
    this.mapFiltersService.announceCurrentLayer(val);

  }

  public getIndecesForLayer(): StatsIndeces[] {
    return STATS_INDECES.filter(idc => idc.layer === this.mapStatsService.selectedStatsLayer)
  }

  public setIndice(idx: StatsIndeces): void {
    this.mapStatsService.selectedStatsIndex = idx;
    this.mapMessagesService.showMapMessage({
      message: this.mapStatsService.selectedStatsIndex.label,
      action: '✖',
      duration: 30000,
      hPosition: 'center',
      vPosition: 'bottom',
      styleClass: 'map-snackbar'
    });
    this.mapStatsService.numericClasses = this.mapStatsService.selectedStatsIndex.type === StatTypes.number ?
      this.mapStatsService.getNumericClasses() :
      [];

    this.mapStatsService.generateClassColors();

    if (idx.layer === StatLayers.bus_stops) {
      this.cleanRefreshWebGlLayer();
    } else {
      this.mapLayersService.WebGlStatsLayer.getSource().refresh();
    }
  }

  private cleanRefreshWebGlLayer(): void {
    this.mapService.smartCityMap.removeLayer(this.mapLayersService.WebGlStatsLayer);
    this.mapLayersService.WebGlStatsLayer.dispose();
    this.mapLayersService.initWebGlStatsLayer(true);
    this.mapService.smartCityMap.addLayer(this.mapLayersService.WebGlStatsLayer);
  }

}
