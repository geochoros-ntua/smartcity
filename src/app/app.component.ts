import { DarkThemeService } from './shared/dark-theme/dark-theme.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

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


  constructor(public darkThemeService: DarkThemeService) { 
    this.darkThemeService.isDarkTheme$.subscribe(status => {
      this.isDarkTheme = status;
    })
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
