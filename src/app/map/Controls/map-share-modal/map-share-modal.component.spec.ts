import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapShareModalComponent } from './map-share-modal.component';

describe('MapShareModalComponent', () => {
  let component: MapShareModalComponent;
  let fixture: ComponentFixture<MapShareModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapShareModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapShareModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
