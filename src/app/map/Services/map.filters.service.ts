import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapFiltersService {

  private currentLayer = new Subject<string>();
  currentLayer$ = this.currentLayer.asObservable();

  private statsResults = new Subject<any>();
  statsResults$ = this.statsResults.asObservable();

  private filtersResults = new Subject<number[]>();
  filtersResults$ = this.filtersResults.asObservable();

  private toggleStatsAndFiltersPanel = new Subject<boolean>();
  toggleStatsAndFiltersPanel$ = this.toggleStatsAndFiltersPanel.asObservable();

  constructor() { }

  announceCurrentLayer(currentLayer: string) {
    return this.currentLayer.next(currentLayer);
  }

  announceStatsResults(statsResults: any) {
    return this.statsResults.next(statsResults);
  }

  announceFiltersResults(filtersResults: number[]) {
    return this.filtersResults.next(filtersResults);
  }

  announceStatsAndFiltersPanel(statsAndFiltersPanel: boolean) {
    return this.toggleStatsAndFiltersPanel.next(statsAndFiltersPanel);
  }
}
