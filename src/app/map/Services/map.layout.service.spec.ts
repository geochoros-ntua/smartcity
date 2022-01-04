import { TestBed } from '@angular/core/testing';

import { Map.LayoutService } from './map.layout.service';

describe('Map.LayoutService', () => {
  let service: Map.LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Map.LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
