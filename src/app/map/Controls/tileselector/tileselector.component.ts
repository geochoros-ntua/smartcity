import { Component } from '@angular/core';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { TileLayerNames } from '../../api/map.enums';
import { MapLayersService } from '../../Services/map.layers.service';


@Component({
  selector: 'app-tileselector',
  templateUrl: './tileselector.component.html',
  styleUrls: ['./tileselector.component.scss']
})
export class TileselectorComponent {

  constructor(private mapLayersService: MapLayersService, private dDarkThemeService: DarkThemeService) { }

  setTileLayer(val: TileLayerNames): void  {
    switch (val) {
      case TileLayerNames.OsmLayer: {
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(true);
        this.mapLayersService.GosmLayer.setVisible(false);
        break;
      }
      case TileLayerNames.GosmLayer: {
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false);
        this.mapLayersService.GosmLayer.setVisible(true);
        break;
      }
      case TileLayerNames.cartoDarkLayer: {
        this.setCartoOnThemeSwitcher();
        this.mapLayersService.OsmLayer.setVisible(false);
        this.mapLayersService.GosmLayer.setVisible(false);
        break;
      }
      case TileLayerNames.none: {
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false);
        this.mapLayersService.GosmLayer.setVisible(false);
        break;
      }
      default: {
        throw new Error(`No such tile layer exist: ${val}`);
      }
    }
  }

  setCartoOnThemeSwitcher(): void{
    if ( this.dDarkThemeService.darkTheme === true){
      this.mapLayersService.cartoDarkLayer.setVisible(true);
      this.mapLayersService.cartoLightLayer.setVisible(false);
    } else {
      this.mapLayersService.cartoDarkLayer.setVisible(false);
      this.mapLayersService.cartoLightLayer.setVisible(true);
    }
  }

}
