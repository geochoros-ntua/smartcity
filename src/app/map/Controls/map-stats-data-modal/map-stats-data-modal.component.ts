import { Component, OnInit } from '@angular/core';
import { MapLayersService } from '../../Services/map.layers.service';
import { StatsService } from '../../Services/map.stats.service';
import { MapService } from '../../Services/map.service';
import { StatTypes } from '../../api/map.enums';
import { FeatureLike } from 'ol/Feature';


@Component({
  selector: 'app-map-stats-data-modal',
  templateUrl: './map-stats-data-modal.component.html',
  styleUrls: ['./map-stats-data-modal.component.scss']
})

export class MapStatsDataModalComponent implements OnInit {

  
  constructor(
    public mapService: MapService,
    public mapStatsService: StatsService,
    public mapLayersService: MapLayersService) { 
  }

  ngOnInit(): void {
  }


  public cleanRefreshWebGlLayer(): void{
    this.mapService.smartCityMap.removeLayer(this.mapLayersService.WebGlStatsLayer);
    this.mapLayersService.WebGlStatsLayer.dispose();
    this.mapLayersService.initWebGlStatsLayer(true);
    this.mapService.smartCityMap.addLayer(this.mapLayersService.WebGlStatsLayer);



    this.mapLayersService.webGlStatsSource.once('featuresloadend', (e) => {
      this.mapStatsService.countAll = this.mapLayersService.webGlStatsSource.getFeatures().length;
      this.resetCountersForClasses();
    
      if (this.mapLayersService.DrawRectangleSelectLayer.getSource().getFeatures().length>0){
        const newFeats = this.mapLayersService.webGlStatsSource.getFeaturesInExtent(
          this.mapLayersService.DrawRectangleSelectLayer.getSource().getFeatures()[0].getGeometry().getExtent()
          );
        this.mapLayersService.webGlStatsSource.clear();
        this.mapLayersService.webGlStatsSource.addFeatures(newFeats);
      }

      // update the heatmap if enabled
      if (this.mapStatsService.heatEnable){
        if (this.mapLayersService.HeatMapLayer){
          this.mapService.smartCityMap.removeLayer(this.mapLayersService.HeatMapLayer);
          this.mapLayersService.HeatMapLayer.dispose();
        }
        this.mapLayersService.initHeatmapLayer(true);
        this.mapService.smartCityMap.addLayer(this.mapLayersService.HeatMapLayer);
      }

      
      // calculate the counters
      this.mapStatsService.countFiltered = 0;
      
      this.mapLayersService.webGlStatsSource.getFeatures().forEach(feat => {
        const isFiltered = this.mapStatsService.getFeatureVisiblity(feat)
        if (isFiltered === 1){
          this.mapStatsService.countFiltered++
          this.calcCountersForClasses(feat);
        }
      });
    })
  }


  private resetCountersForClasses(): void {
    if (this.mapStatsService.selectedStatsIndex?.type === StatTypes.class){
      this.mapStatsService.selectedStatsIndex.classes.forEach(cls => {
        cls.counter = 0;
      })
    }  else {
      this.mapStatsService.numericClasses?.forEach(cls => {
        cls.counter = 0;
      })
    }
  }

  private calcCountersForClasses(feat: FeatureLike): void {
    if (this.mapStatsService.selectedStatsIndex?.type === StatTypes.class){
      const featVal = feat.get(this.mapStatsService.selectedStatsIndex.code);
      const idx = this.mapStatsService.selectedStatsIndex.classes.findIndex(cls => cls.value === featVal);
      this.mapStatsService.selectedStatsIndex.classes[idx !== -1 ? idx : 0].counter++;
    } else {
      const featVal = feat.get(this.mapStatsService.selectedStatsIndex?.code);
      const classIdx = this.mapStatsService.numericClasses?.findIndex(
        (cls,i) => featVal >= cls.min && ((i !== this.mapStatsService.numericClasses.length-1) ? (featVal -1 < cls.max) : true)
      );

      if(this.mapStatsService.numericClasses && this.mapStatsService.numericClasses.length>0){
          this.mapStatsService.numericClasses[classIdx && classIdx !== -1 ? classIdx : 0].counter++;
      }
    }
  }
  
}