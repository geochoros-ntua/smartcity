import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
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
  public fileUrl: SafeResourceUrl;
  public filename: string = 'file.geojson';
  constructor(

    private sanitizer: DomSanitizer,
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


  public downloadIndexOnCsv(){
    const allFeats = this.mapLayersService.webGlStatsSource.getFeatures();
    const writer = new GeoJSON({
      featureProjection : 'EPSG:3857'
    });
    const data = writer.writeFeatures(allFeats.map(f =>  {
          const feat = new Feature({
            geometry: f.getGeometry()
          });
          const selIndex = this.mapStatsService.selectedStatsIndex;
          feat.set(selIndex.code, 
            selIndex.type === StatTypes.number ? f.get(selIndex.code) : selIndex.classes.find(cls => cls.value == f.get(selIndex.code))?.label);
          return feat;
      }
    ));
    this.filename = this.mapStatsService.selectedStatsIndex.label +'.geojson';
    const blob = new Blob([data], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  
}
