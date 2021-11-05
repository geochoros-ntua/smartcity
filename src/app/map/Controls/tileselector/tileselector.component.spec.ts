import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapLayersService } from '../../Services/map.layers.service';

import { TileselectorComponent } from './tileselector.component';

describe('TileselectorComponent', () => {
  let component: TileselectorComponent;
  let fixture: ComponentFixture<TileselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileselectorComponent ],
      providers: [MapLayersService, HttpClient, HttpHandler],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
