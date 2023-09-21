import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapShareComponent } from './map-share.component';

describe('MapShareComponent', () => {
  let component: MapShareComponent;
  let fixture: ComponentFixture<MapShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
