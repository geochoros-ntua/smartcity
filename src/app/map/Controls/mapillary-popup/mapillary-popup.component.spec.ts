import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapillaryPopupComponent } from './mapillary-popup.component';

describe('MapillaryPopupComponent', () => {
  let component: MapillaryPopupComponent;
  let fixture: ComponentFixture<MapillaryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapillaryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapillaryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
