import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsGraphComponent } from './sensors-graph.component';

describe('SensorsGraphComponent', () => {
  let component: SensorsGraphComponent;
  let fixture: ComponentFixture<SensorsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
