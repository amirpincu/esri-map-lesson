import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CityWeatherData } from 'src/app/services/city-weather.model';

@Component({
  selector: 'city-weather-card-comp',
  templateUrl: './city-weather-card-comp.component.html',
  styleUrls: ['./city-weather-card-comp.component.scss']
})
export class CityWeatherCardCompComponent implements OnInit, OnDestroy {
  @Input()
  data: CityWeatherData = { cityName: `City not specified`, temp: 0, maxTemp: 1, minTemp: -1, weatherDesc: '01d'};

  public weatherImageSrc(): string {
    const url: string = `assets/weather-pics/${this.data.weatherDesc}.png`;
    return url;
  }

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {

  }
}
