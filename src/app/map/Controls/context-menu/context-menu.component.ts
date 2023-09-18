import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as olProj from 'ol/proj';
import { SmartCityMapillaryConfig } from '../../api/map.api';
import { MapService } from '../../Services/map.service';
import { MapMapillaryService } from '../../Services/map.mapillary.service';
import MapUtils from '../../map.helper';
import { HttpClient } from '@angular/common/http';
import { MapLayersService } from '../../Services/map.layers.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  @Input() x: number = 0;
  @Input() y: number = 0;

  @Output() closeCtxMenu$ = new EventEmitter<void>();


  constructor(
    private http: HttpClient,
    private mapService: MapService, 
    private mapLayersService: MapLayersService,
    public mapMapillaryService: MapMapillaryService) {
  }

  ngOnInit(): void {

  }

  public showMapillaryView(): void{
    this.mapLayersService.dataLoaded = false;
    const point = olProj.transform( this.mapService.smartCityMap.getCoordinateFromPixel([this.x, this.y]), 'EPSG:3857', 'EPSG:4326');
    this.closeCtxMenu$.emit();
    this.http.get(MapUtils.backEndBaseUrl + 'findClosestMplImage.php?x=' +  point[0] + '&y=' + point[1])
        .subscribe((result: any) => {
          this.mapLayersService.dataLoaded = true;
          const mapillaryViewerConfig: SmartCityMapillaryConfig = {
            imageId: result[0].id,
            mapillaryDivId: this.mapService.smartCityMapConfig.mapillaryDivId,
            map: this.mapService.smartCityMap
          };
          this.mapMapillaryService.showMapillaryViewer(mapillaryViewerConfig);
          
    });

}}
