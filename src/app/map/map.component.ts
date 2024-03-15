import { MyTourService } from './../my-tour.service';
import { MapLayersService } from './Services/map.layers.service';
import { Component, OnInit } from '@angular/core';
import { MapService } from './Services/map.service';
import { MapBrowserEvent } from 'ol';
import { MapMode, StatTypes } from './api/map.enums';
import { SensorsService } from './Services/map.sensors.service';
import { ActivatedRoute } from '@angular/router';
import MapUtils from './map.helper';
import { StatsService } from './Services/map.stats.service';
import { STATS_INDECES } from './api/map.datamaps';
import { ShareMapParams } from './api/map.api';
import { INominatimResponse } from '../shared/address-finder/nominatim.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  isStreet: boolean;
  isStats: boolean;
  isStatsForGuide: boolean;

  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;

  results!: INominatimResponse[];
  toggleDash = true;

  constructor(
    public mapService: MapService,
    private router: ActivatedRoute,
    public mapLayersService: MapLayersService,
    public mapStatsService: StatsService,
    public mapSensorsService: SensorsService,
    private myTourService: MyTourService
  ) {
    this.myTourService.tourStep$.subscribe((step) => {
      if (!this.isStats) {
        if (step === 35) {
          this.isStats = true;
        } else {
          this.isStats = false;
        }
      }
    });

    this.myTourService.startGuide$.subscribe((status) => {
      if (status) {
        console.log(this.isStats);
        this.isStatsForGuide = this.isStats;
      }
    });

    this.myTourService.closeGuide$.subscribe((status) => {
      if (status) {
        console.log(this.isStatsForGuide);
        this.isStats = this.isStatsForGuide;
      }
    });
  }

  public ngOnInit(): void {
    this.mapService.initMap();
    this.registerMapEvents(this);
    this.resetMapType(this.mapService.mapMode);
    this.mapService.mapMode$.subscribe((mode) => {
      this.resetMapType(mode);
    });

    this.router.queryParams.subscribe((params: ShareMapParams) => {
      if (params.zoom)
        this.mapService.smartCityMap.getView().setZoom(parseInt(params.zoom));
      if (params.center)
        this.mapService.smartCityMap
          .getView()
          .setCenter(
            params.center.split(',').map((co: string) => parseFloat(co))
          );

      if (params.mode) {
        this.mapService.mapMode$.next(
          MapUtils.getEnumByEnumValue(MapMode, params.mode)
        );
        if (params.mode === MapMode.stats && params.index) {
          this.mapStatsService.selectedStatsLayer =
            this.mapStatsService.getLayerFormIndex(params.index);
          this.mapService.smartCityMap.removeLayer(
            this.mapLayersService.WebGlStatsLayer
          );
          this.mapLayersService.WebGlStatsLayer.dispose();

          this.mapStatsService.selectedStatsIndex = params.index
            ? STATS_INDECES.find((idx) => idx.code === params.index)
            : STATS_INDECES.find((idx) => idx.code === 'A_14');

          this.mapStatsService.numericClasses =
            this.mapStatsService.selectedStatsIndex.type === StatTypes.number
              ? this.mapStatsService.getNumericClasses(
                  this.mapStatsService.selectedStatsIndex
                )
              : [];
          this.mapStatsService.generateClassColors();

          this.mapLayersService.initWebGlStatsLayer(true, params.index);
          this.mapService.smartCityMap.addLayer(
            this.mapLayersService.WebGlStatsLayer
          );
        }
      }
    });
  }

  public ngOnDestroy() {
    this.mapSensorsService.stopReportAutoLoad();
    this.mapService.stopFlashIntervals();
  }

  private resetMapType(mode: MapMode): void {
    this.isStreet = mode === MapMode.street;
    this.isStats = mode === MapMode.stats;
  }

  private registerMapEvents(thisP: MapComponent): void {
    // once first map render
    this.mapService.smartCityMap.once('rendercomplete', () => {
      thisP.mapService.smartCityMap.updateSize();
    });

    // click on map event
    this.mapService.smartCityMap.on(
      'click',
      (event: MapBrowserEvent<UIEvent>) => {
        this.disableContextMenu();
        this.mapService.onMapClicked(event);
      }
    );

    // right click on map event
    this.mapService.smartCityMap
      .getViewport()
      .addEventListener('contextmenu', (evt) => {
        evt.preventDefault();
        this.contextmenuX = evt.clientX;
        this.contextmenuY = evt.clientY;
        this.contextmenu = true;
      });

    // click on zoom level change
    this.mapService.smartCityMap.getView().on('change:resolution', (event) => {
      const curZoom = this.mapService.smartCityMap.getView().getZoom();
      this.mapLayersService.heatBlur = curZoom > 14 ? 40 : 30;
      this.mapLayersService.heatRadius = curZoom > 14 ? 25 : 15;
      this.mapLayersService.HeatMapLayer.setBlur(
        this.mapLayersService.heatBlur
      );
      this.mapLayersService.HeatMapLayer.setRadius(
        this.mapLayersService.heatRadius
      );
    });

    // pointer on feature hover
    this.mapService.smartCityMap.on(
      'pointermove',
      (event: MapBrowserEvent<UIEvent>) => {
        const pixel = thisP.mapService.smartCityMap.getEventPixel(
          event.originalEvent
        );
        const hit = thisP.mapService.smartCityMap.forEachFeatureAtPixel(
          pixel,
          (f, l) => {
            return f && l;
          }
        );

        thisP.mapService.smartCityMap.getViewport().style.cursor = hit
          ? 'pointer'
          : '';
      }
    );
  }

  //activates the menu with the coordinates
  public onMapRightClick(event: any) {
    this.contextmenuX = event.clientX;
    this.contextmenuY = event.clientY - 50;
    this.contextmenu = true;
  }
  //disables the menu
  public disableContextMenu() {
    this.contextmenu = false;
  }
}
