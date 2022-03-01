import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatsModeComponent } from './map-stats-mode.component';

describe('MapStatsModeComponent', () => {
  let component: MapStatsModeComponent;
  let fixture: ComponentFixture<MapStatsModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatsModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStatsModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
