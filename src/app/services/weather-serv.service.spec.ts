import { TestBed } from '@angular/core/testing';

import { WeatherServService } from './weather-serv.service';

describe('WeatherServService', () => {
  let service: WeatherServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
