import { DarkThemeService } from './shared/dark-theme/dark-theme.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Athens Smart City!';

  isDarkTheme: boolean = false;

  constructor(private darkThemeService: DarkThemeService) {
    this.darkThemeService.isDarkTheme$.subscribe((status: boolean): void => {
      this.isDarkTheme = status;
    })
  }

  ngOnInit(): void {
    if (localStorage.getItem('isDarkTheme')) {
      this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme'));
      this.darkThemeService.sendIsDarkTheme(this.isDarkTheme);
    }
  }

}
