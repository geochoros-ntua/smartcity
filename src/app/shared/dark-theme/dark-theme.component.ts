import { MapLayersService } from './../../map/Services/map.layers.service';
import { DarkThemeService } from './dark-theme.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dark-theme',
  templateUrl: './dark-theme.component.html',
  styleUrls: ['./dark-theme.component.scss']
})
export class DarkThemeComponent implements OnInit {

  isDarkTheme: boolean = false;

  constructor(private darkThemeService: DarkThemeService, private mapLayersService: MapLayersService) {
    this.darkThemeService.isDarkTheme$.subscribe((status: boolean) => {
      this.isDarkTheme = status;
    })
  }

  ngOnInit(): void {
    // if (localStorage.getItem('isDarkTheme')) {
    //   this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme'));
    // }
   }

  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    this.darkThemeService.sendIsDarkTheme(this.isDarkTheme);
    if (this.isDarkTheme) {
      this.mapLayersService.cartoLightLayer.setVisible(false);
      this.mapLayersService.cartoDarkLayer.setVisible(true);
    }
    else {
      this.mapLayersService.cartoLightLayer.setVisible(true);
      this.mapLayersService.cartoDarkLayer.setVisible(false);
    }
  }

}
