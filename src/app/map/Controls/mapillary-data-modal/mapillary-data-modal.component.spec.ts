import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapillaryDataModalComponent } from './mapillary-data-modal.component';

describe('MapillaryFilterModalComponent', () => {
  let component: MapillaryDataModalComponent;
  let fixture: ComponentFixture<MapillaryDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapillaryDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapillaryDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
