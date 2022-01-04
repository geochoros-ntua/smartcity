import { Component } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { MapLayoutService } from './map/Services/map.layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Athens Smart City!';

  currentView: number = 1;
  isMap: boolean = false;

  isDarkTheme: boolean = false;

  toggleStreetView() {
    this.currentView = 0;
    this.mapLayoutService.announceCurrentView(0);
  }

  toggleMap() {
    this.currentView = 1;
    this.mapLayoutService.announceCurrentView(1);
  }

  constructor(private mapLayoutService: MapLayoutService, private router: Router) {


    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            if (event.url === '/map') {
              this.isMap = true;
            }
            else {
              this.isMap = false;
            }
          }
        });

  }


  changeTheme(): void {
    if (this.isDarkTheme) {
       this.isDarkTheme = false;
       this.mapLayoutService.announceDarkTheme(this.isDarkTheme)          
       
    } else {
       this.isDarkTheme = true;
       this.mapLayoutService.announceDarkTheme(this.isDarkTheme)
    }
 }

}
