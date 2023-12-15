import { DarkThemeService } from './shared/dark-theme/dark-theme.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { StatsService } from './map/Services/map.stats.service';
import { MapMapillaryService } from './map/Services/map.mapillary.service';
import { TourService } from 'ngx-ui-tour-md-menu';
import { MyTourService } from './my-tour.service';

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

  tourButtonsDis = false;
  prevStep: number = 0;
  nextStep: number = 0;
  currentStep: number = 0;
  showGuide: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }


  constructor(
    public darkThemeService: DarkThemeService,
    private router: Router,
    private mapStatsService: StatsService,
    private mapillaryService: MapMapillaryService,
    public tourService: TourService,
    private myTourService: MyTourService
  ) {
    this.darkThemeService.isDarkTheme$.subscribe(status => {
      this.isDarkTheme = status;
    })


    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.mapillaryService.mapillaryDialogRef?.close();
        this.mapStatsService.statDialogRef?.close();
        this.mapillaryService.mplDataDialogRef?.close();
      }
    });

    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/home')) {
          this.showGuide = true;
        }
        else if (event.url.startsWith('/responses')) {
          this.showGuide = true;
        }
        else if (event.url.startsWith('/neighborhoods')) {
          this.showGuide = true;
        }
        else if (event.url.startsWith('/indices')) {
          this.showGuide = true;
        }
        else if (event.url.startsWith('/map')) {
          this.showGuide = true;
        }
        else {
          this.showGuide = false;
        }
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

  startGuide() {
    this.myTourService.announceStartGuide(true);
    switch (this.router.url) {
      case '/home':
        this.tourService.initialize(this.myTourService.homeGuide);
        this.tourService.start();
        break;
      case '/responses':
        this.tourService.initialize(this.myTourService.responsesGuide);
        this.tourService.start();
        break;
      case '/neighborhoods':
        this.tourService.initialize(this.myTourService.neighborhoodsGuide);
        this.tourService.start();
        break;
      case '/indices':
        this.tourService.initialize(this.myTourService.indicesGuide);
        this.tourService.start();
        break;
      case '/map':
        this.tourService.initialize(this.myTourService.mapGuide);
        this.tourService.start();
        break;
      default:
        break;
    }
  };

  toggleSideNavPrev(step: any) {
    this.tourButtonsDis = true;
    this.prevStep = step;
    this.currentStep = parseInt(step) - 1;
    this.myTourService.announceTourStep(parseInt(step) - 1);
    setTimeout(() => {
      this.tourService.prev();
      this.tourButtonsDis = false;
    }, 100);

  };

  toggleSideNavNext(step: any) {
    this.tourButtonsDis = true;
    this.nextStep = step;
    this.currentStep = parseInt(step) + 1;
    this.myTourService.announceTourStep(parseInt(step) + 1);

    setTimeout(() => {
      this.tourService.next();
      this.tourButtonsDis = false;
    }, 100);

  };

  closeGuide() {
    this.myTourService.announceCloseGuide(true);
  }

}
