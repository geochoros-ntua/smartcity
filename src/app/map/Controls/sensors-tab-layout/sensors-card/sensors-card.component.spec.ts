import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsCardComponent } from './sensors-card.component';

describe('SensorsCardComponent', () => {
  let component: SensorsCardComponent;
  let fixture: ComponentFixture<SensorsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
