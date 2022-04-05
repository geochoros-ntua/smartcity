import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {


  private isDarkTheme: boolean = false;
  public isDarkTheme$ = new BehaviorSubject<boolean>(false);

  constructor(private mapLayersService: MapLayersService) {
    // lets keep a single subscription for theme switching
    // and put any possible implementation in here  
    this.isDarkTheme$.pipe(
      tap(val => {
        this.isDarkTheme = val;
      }),
      filter( _ => !!this.mapLayersService.cartoDarkLayer)
    ).subscribe((status: boolean) => {
      this.mapLayersService.cartoDarkLayer.setVisible(status);
      this.mapLayersService.cartoLightLayer.setVisible(!status);
      localStorage.setItem('isDarkTheme', JSON.stringify(status));
    });
  }

  public get darkTheme(): boolean {
    return this.isDarkTheme;
  }

 
}
