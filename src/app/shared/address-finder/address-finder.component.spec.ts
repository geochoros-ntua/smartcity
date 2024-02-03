import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFinderComponent } from './address-finder.component';

describe('AddressFinderComponent', () => {
  let component: AddressFinderComponent;
  let fixture: ComponentFixture<AddressFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
