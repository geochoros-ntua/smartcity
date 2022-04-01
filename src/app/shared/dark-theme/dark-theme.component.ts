import { MapLayersService } from './../../map/Services/map.layers.service';
import { DarkThemeService } from './dark-theme.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dark-theme',
  templateUrl: './dark-theme.component.html',
  styleUrls: ['./dark-theme.component.scss']
})
export class DarkThemeComponent {


  constructor(public darkThemeService: DarkThemeService, private mapLayersService: MapLayersService) {
    
  }


  toggleTheme() {
    const isDarkTheme = !this.darkThemeService.darkTheme;
    localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme));
    this.darkThemeService.isDarkTheme$.next(isDarkTheme);
  }

}
