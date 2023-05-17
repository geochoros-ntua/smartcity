import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatsDataComponent } from './map-stats-data.component';

describe('MapStatsDataComponent', () => {
  let component: MapStatsDataComponent;
  let fixture: ComponentFixture<MapStatsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStatsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
