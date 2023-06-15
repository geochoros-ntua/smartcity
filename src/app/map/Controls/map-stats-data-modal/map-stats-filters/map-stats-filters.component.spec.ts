import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatsFiltersComponent } from './map-stats-filters.component';

describe('MapStatsFiltersComponent', () => {
  let component: MapStatsFiltersComponent;
  let fixture: ComponentFixture<MapStatsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStatsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
