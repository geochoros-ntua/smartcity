import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsTabLayoutComponent } from './sensors-tab-layout.component';

describe('SensorsTabLayoutComponent', () => {
  let component: SensorsTabLayoutComponent;
  let fixture: ComponentFixture<SensorsTabLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsTabLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsTabLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
