import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapillaryDataComponent } from './mapillary-data.component';

describe('MapillaryFilterComponent', () => {
  let component: MapillaryDataComponent;
  let fixture: ComponentFixture<MapillaryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapillaryDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapillaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
