import { MapLayersService } from './Services/map.layers.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from './Services/map.service';
import { MapBrowserEvent } from 'ol';
import { MapMode, StatLayers, StatTypes } from './api/map.enums';
import { SensorsService } from './Services/map.sensors.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import MapUtils from './map.helper';
import { StatsService } from './Services/map.stats.service';
import { STATS_INDECES } from './api/map.datamaps';
import { MapStatsDataModalComponent } from './Controls/map-stats-data-modal/map-stats-data-modal.component';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})



export class MapComponent implements OnInit {
  isStreet: boolean; 
  isStats: boolean; 

  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;


  constructor(
    private mapService: MapService, 
    private router: ActivatedRoute,
    public mapLayersService: MapLayersService, 
    public mapStatsService: StatsService,
    public mapSensorsService: SensorsService) {

  }

  ngOnInit(): void {
    this.mapService.initMap();
    this.registerMapEvents(this);
    this.resetMapType(this.mapService.mapMode);
    this.mapService.mapMode$.subscribe( mode =>{
      this.resetMapType(mode);
    });
   
    //http://localhost:4200/map?zoom=15&mode=stats&layer=

    this.router.queryParams.subscribe((params: any) => {
      console.log('params',params)
      if (params.zoom ) {
        
        const zoomLevel: number = parseInt(params.zoom);
        // const coords: number[] = params.center.split(',').map((co:any) => parseFloat(co));
        //this.mapService.smartCityMap.getView().setCenter(coords);
        console.log('zoom level',zoomLevel)
        this.mapService.smartCityMap.getView().setZoom(zoomLevel);
      }

      if (params.mode) {
        console.log('set map mode',params.mode)
        this.mapService.mapMode$.next(MapUtils.getEnumByEnumValue(MapMode, params.mode));
        if (params.mode === MapMode.stats){

          this.mapStatsService.selectedStatsLayer = this.mapStatsService.getLayerFormIndex(params.index);
          this.mapService.smartCityMap.removeLayer(this.mapLayersService.WebGlStatsLayer);
          this.mapLayersService.WebGlStatsLayer.dispose();
          this.mapLayersService.initWebGlStatsLayer(true, params.index);
          this.mapService.smartCityMap.addLayer(this.mapLayersService.WebGlStatsLayer);
        } else {

        }
      }
    })
    
    
  }

  ngOnDestroy(){
    this.mapSensorsService.stopReportAutoLoad();
    this.mapService.stopFlashIntervals();
  }

  private resetMapType(mode:MapMode): void{
    this.isStreet = (mode === MapMode.street);
    this.isStats = (mode === MapMode.stats);
  }


  private registerMapEvents(thisP: MapComponent): void {

    // once first map render
    this.mapService.smartCityMap.once('rendercomplete', () => {
      thisP.mapService.smartCityMap.updateSize();
    });

     // click on map event
    this.mapService.smartCityMap.on('click', (event: MapBrowserEvent<UIEvent>) => {
      this.disableContextMenu();
      this.mapService.onMapClicked(event);
    });

    // right click on map event
    this.mapService.smartCityMap.getViewport().addEventListener('contextmenu',  (evt) => {
      evt.preventDefault();
      this.contextmenuX = evt.clientX
      this.contextmenuY = evt.clientY
      this.contextmenu = true;
    });


     // click on zoom level change
    this.mapService.smartCityMap.getView().on('change:resolution', (event) => {
      const curZoom = this.mapService.smartCityMap.getView().getZoom();
      this.mapLayersService.heatBlur = curZoom > 14 ? 40 : 30;
      this.mapLayersService.heatRadius = curZoom > 14 ? 25 : 15;
      this.mapLayersService.HeatMapLayer.setBlur(this.mapLayersService.heatBlur);
      this.mapLayersService.HeatMapLayer.setRadius(this.mapLayersService.heatRadius);
    });


    // pointer on feature hover
    this.mapService.smartCityMap.on('pointermove', (event: MapBrowserEvent<UIEvent>) => {
      const pixel = thisP.mapService.smartCityMap.getEventPixel(event.originalEvent);
      const hit = thisP.mapService.smartCityMap.forEachFeatureAtPixel(pixel, (f, l) => {
        return (f && l);
      }); 

      thisP.mapService.smartCityMap.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }



  //activates the menu with the coordinates
  public onMapRightClick(event: any){
      this.contextmenuX = event.clientX
      this.contextmenuY = event.clientY - 50;
      this.contextmenu = true;
  }
  //disables the menu
  public disableContextMenu(){
     this.contextmenu = false;
  }
}
