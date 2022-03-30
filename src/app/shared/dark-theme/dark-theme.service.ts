import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeService {


  private isDarkTheme: boolean = false;
  private isDarkThemeS = new Subject<boolean>();
  isDarkTheme$ = this.isDarkThemeS.asObservable();


  sendIsDarkTheme(isDarkTheme: boolean): void {
    this.isDarkTheme = isDarkTheme;
    this.isDarkThemeS.next(isDarkTheme);
  }

  getIsDarkTheme() {
    return this.isDarkTheme;
  }

  constructor() { }
}
