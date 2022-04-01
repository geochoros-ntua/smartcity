import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {


  private isDarkTheme: boolean = false;
  public isDarkTheme$ = new BehaviorSubject<boolean>(true);

  constructor(private mapLayersService: MapLayersService) {
    // lets keep a single subscription for theme switching
    // and put any possible implementation in here  
    this.isDarkTheme$.subscribe((status: boolean) => {
      this.isDarkTheme = status;
      if ( status ){
        this.mapLayersService.cartoDarkLayer.setVisible(true);
        this.mapLayersService.cartoLightLayer.setVisible(false);
      } else {
        this.mapLayersService.cartoDarkLayer.setVisible(false);
        this.mapLayersService.cartoLightLayer.setVisible(true);
      }
      localStorage.setItem('isDarkTheme', JSON.stringify(status));
    });
  }

  public get darkTheme(): boolean {
    return this.isDarkTheme;
  }

 
}
