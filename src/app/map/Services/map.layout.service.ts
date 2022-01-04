import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapLayoutService {

  // currentView (map/streetView) observable

  private currentView = new Subject<number>();
  currentView$ = this.currentView.asObservable();

  announceCurrentView(currentView: number) {
    this.currentView.next(currentView);
  }


  // dark theme observable

  private darkTheme = new Subject<boolean>();
  darkTheme$ = this.darkTheme.asObservable();


  announceDarkTheme(darkTheme: boolean) {
    this.darkTheme.next(darkTheme);
  }

  constructor() { }
}
