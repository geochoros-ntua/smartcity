import { DarkThemeService } from './shared/dark-theme/dark-theme.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { StatsService } from './map/Services/map.stats.service';
import { MapMapillaryService } from './map/Services/map.mapillary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent implements OnInit {

  innerWidth = window.innerWidth;
  isDarkTheme: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }


  constructor(
    public darkThemeService: DarkThemeService, 
    private router: Router, 
    private mapStatsService: StatsService,
    private mapillaryService: MapMapillaryService
    ) { 
    this.darkThemeService.isDarkTheme$.subscribe(status => {
      this.isDarkTheme = status;
    })

    
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd){
        this.mapillaryService.mapillaryDialogRef?.close();
        this.mapStatsService.statDialogRef?.close();
        this.mapillaryService.mplDataDialogRef?.close();
      }
  });
  }

  ngOnInit(): void {
    if (localStorage.getItem('isDarkTheme')) {
      const isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme'));
      this.darkThemeService.isDarkTheme$.next(isDarkTheme);
      this.isDarkTheme = isDarkTheme;
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
