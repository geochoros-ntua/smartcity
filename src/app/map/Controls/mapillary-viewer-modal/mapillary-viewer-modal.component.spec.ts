import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapillaryViewerModalComponent } from './mapillary-viewer-modal.component';

describe('MapillaryViewerModalComponent', () => {
  let component: MapillaryViewerModalComponent;
  let fixture: ComponentFixture<MapillaryViewerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapillaryViewerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapillaryViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
