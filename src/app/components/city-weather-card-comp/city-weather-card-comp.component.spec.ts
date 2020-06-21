import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityWeatherCardCompComponent } from './city-weather-card-comp.component';

describe('CityWeatherCardCompComponent', () => {
  let component: CityWeatherCardCompComponent;
  let fixture: ComponentFixture<CityWeatherCardCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityWeatherCardCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityWeatherCardCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
