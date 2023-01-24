import { Component, OnInit } from '@angular/core';
import { DarkThemeService } from 'src/app/shared/dark-theme/dark-theme.service';
import { TileLayerNames } from '../../api/map.enums';
import { MapLayersService } from '../../Services/map.layers.service';


@Component({
  selector: 'app-tileselector',
  templateUrl: './tileselector.component.html',
  styleUrls: ['./tileselector.component.scss']
})
export class TileselectorComponent implements OnInit {

  constructor(private mapLayersService: MapLayersService, private dDarkThemeService: DarkThemeService) { 

  }

  ngOnInit(): void {
    this.setCartoOnThemeSwitcher();
  }

  public setTileLayer(val: TileLayerNames): void  {
    switch (val) {
      case TileLayerNames.OsmLayer: {
        this.mapLayersService.KtimaLayer.setVisible(false);
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(true);
        this.mapLayersService.GosmLayer.setVisible(false);
        break;
      }
      case TileLayerNames.GosmLayer: {
        this.mapLayersService.KtimaLayer.setVisible(false);
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false);
        this.mapLayersService.GosmLayer.setVisible(true);
        break;
      }
      case TileLayerNames.cartoDarkLayer: {
        this.setCartoOnThemeSwitcher();
        this.mapLayersService.KtimaLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false);
        this.mapLayersService.GosmLayer.setVisible(false);
        break;
      }
      case TileLayerNames.ktimaNetLayer: {
        this.mapLayersService.KtimaLayer.setVisible(true);
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(false);
        this.mapLayersService.OsmLayer.setVisible(false);
        this.mapLayersService.GosmLayer.setVisible(false);
        break;
      }
      case TileLayerNames.none: {
        this.mapLayersService.KtimaLayer.setVisible(false);
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

  private setCartoOnThemeSwitcher(): void{
    const isDarkTheme = this.dDarkThemeService.darkTheme;
    this.mapLayersService.cartoDarkLayer.setVisible(isDarkTheme);
    this.mapLayersService.cartoLightLayer.setVisible(!isDarkTheme);
  }

}
