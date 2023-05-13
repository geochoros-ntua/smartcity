import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatsDataModalComponent } from './map-stats-data-modal.component';

describe('MapStatsDataModalComponent', () => {
  let component: MapStatsDataModalComponent;
  let fixture: ComponentFixture<MapStatsDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatsDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStatsDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
