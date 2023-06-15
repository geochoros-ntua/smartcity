import { Component, OnInit } from '@angular/core';
import { MapLayersService } from '../../Services/map.layers.service';
import { StatsService } from '../../Services/map.stats.service';
import { MapService } from '../../Services/map.service';


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
    this.mapLayersService.webGlStatsSource.once('featuresloadend', (e)=>{
      this.mapStatsService.countAll = this.mapLayersService.webGlStatsSource.getFeatures().length;
      if (this.mapLayersService.DrawRectangleSelectLayer.getSource().getFeatures().length>0){
        const newFeats = this.mapLayersService.webGlStatsSource.getFeaturesInExtent(
          this.mapLayersService.DrawRectangleSelectLayer.getSource().getFeatures()[0].getGeometry().getExtent()
          );
        this.mapLayersService.webGlStatsSource.clear();
        this.mapLayersService.webGlStatsSource.addFeatures(newFeats);
      }
      // calculate the counters
      this.mapStatsService.countFiltered = 0;
      this.mapLayersService.webGlStatsSource.getFeatures().forEach(feat => {
        const isFiltered = this.mapStatsService.getFeatureVisiblity(feat)
        if (isFiltered === 1){
          this.mapStatsService.countFiltered++
        }
      });

    })
  }
  
}