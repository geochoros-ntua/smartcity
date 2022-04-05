import { DarkThemeService } from './shared/dark-theme/dark-theme.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  
  constructor(public darkThemeService: DarkThemeService) { }

  ngOnInit(): void {
    if (localStorage.getItem('isDarkTheme')) {
      const isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme'));
      this.darkThemeService.isDarkTheme$.next(isDarkTheme);

    }
  }

}
