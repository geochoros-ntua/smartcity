import { TestBed } from '@angular/core/testing';

import { MyTourService } from './my-tour.service';

describe('MyTourService', () => {
  let service: MyTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
