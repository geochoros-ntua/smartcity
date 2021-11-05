import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MapComponent } from './map.component';
import { MapLayersService } from './Services/map.layers.service';
import { MapMapillaryService } from './Services/map.mapillary.service';
import { MapService } from './Services/map.service';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule ],
      declarations: [ MapComponent ],
      providers: [MapService, MapLayersService, MapMapillaryService, MatDialog, HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
