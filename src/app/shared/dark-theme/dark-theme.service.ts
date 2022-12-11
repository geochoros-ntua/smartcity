import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { MapLayersService } from 'src/app/map/Services/map.layers.service';

@Injectable({ 
  providedIn: 'root'
})
export class DarkThemeService {


  private isDarkTheme: boolean = false;
  public isDarkTheme$ = new BehaviorSubject<boolean>(false);
  elementRef: any;
  renderer: any;

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

      // let ScaleElements = this.elementRef.nativeElement.querySelectorAll('.ol-scale-line-inner');
      // console.log('ScaleElements', ScaleElements)
      // let overMapElements = this.elementRef.nativeElement.querySelectorAll('.ol-overviewmap-map');
      // let overMapBoxElements = this.elementRef.nativeElement.querySelectorAll('.ol-overviewmap-box');
      // let tooltipElements = this.elementRef.nativeElement.querySelectorAll('.tooltip');
      // let tooltipStaticElements = this.elementRef.nativeElement.querySelectorAll('.tooltip-static');
      // let popupElements = this.elementRef.nativeElement.querySelectorAll('.ol-popup');
      // let popupCloserElements = this.elementRef.nativeElement.querySelectorAll('.ol-popup-closer');

      // if (this.isDarkTheme) {

        // this.renderer.removeClass(ScaleElements[0], 'ol-scale-line-inner-dark');
        // if (overMapElements[0]) {
        // this.renderer.removeClass(overMapBoxElements[0], 'ol-overviewmap-box-dark');
        // }
        // this.renderer.removeClass(popupElements[0], 'ol-popup-dark');
        // this.renderer.removeClass(popupElements[0], 'ol-popup-background-dark');
        // this.renderer.removeClass(popupCloserElements[0], 'ol-popup-dark-closer');

      // }
    });
  }

  public get darkTheme(): boolean {
    return this.isDarkTheme;
  }

 
}
