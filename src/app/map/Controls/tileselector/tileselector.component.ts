import { Component, OnInit } from '@angular/core';
import { TileLayerNames } from '../../api/map.interfaces';
import { MapLayersService } from '../../Services/map.layers.service';


@Component({
  selector: 'app-tileselector',
  templateUrl: './tileselector.component.html',
  styleUrls: ['./tileselector.component.scss']
})
export class TileselectorComponent implements OnInit {

  constructor(private mapLayersService: MapLayersService) { }

  ngOnInit(): void {
  }

  setTileLayer (val: TileLayerNames) {
    switch(val) { 
      case TileLayerNames.OsmLayer: { 
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(true); 
        this.mapLayersService.GosmLayer.setVisible(false);
        break; 
      } 
      case TileLayerNames.GosmLayer: { 
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false); 
        this.mapLayersService.GosmLayer.setVisible(true);
        break; 
      } 
      case TileLayerNames.cartoDarkLayer: { 
        this.mapLayersService.cartoDarkLayer.setVisible(true);
        this.mapLayersService.OsmLayer.setVisible(false); 
        this.mapLayersService.GosmLayer.setVisible(false);
        break; 
      } 
      case TileLayerNames.none: { 
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false); 
        this.mapLayersService.GosmLayer.setVisible(false);
        break; 
      } 
      default: { 
        throw new Error(`No such tile layer exist: ${ val }`);
      } 
   } 
  }

}
