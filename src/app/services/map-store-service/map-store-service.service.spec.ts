import { TestBed } from '@angular/core/testing';

import { MapStoreServiceService } from './map-store-service.service';

describe('MapStoreServiceService', () => {
  let service: MapStoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapStoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
