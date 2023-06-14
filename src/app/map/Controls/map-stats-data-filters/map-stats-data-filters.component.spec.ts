import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatsDataFiltersComponent } from './map-stats-data-filters.component';

describe('MapStatsDataFiltersComponent', () => {
  let component: MapStatsDataFiltersComponent;
  let fixture: ComponentFixture<MapStatsDataFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatsDataFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStatsDataFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
