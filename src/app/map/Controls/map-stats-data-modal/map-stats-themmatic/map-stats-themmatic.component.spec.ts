import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatsThemmaticComponent } from './map-stats-themmatic.component';

describe('MapStatsThemmaticComponent', () => {
  let component: MapStatsThemmaticComponent;
  let fixture: ComponentFixture<MapStatsThemmaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatsThemmaticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStatsThemmaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
