import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WeatherConstants } from './constants.model';
import { CityWeatherData } from './city-weather.model';

export enum WeatherAPIResponseCod {
  valid = 200,
  cityNotFound = 404,
  invalidApiKey = 401,
  unknown = -1
}

@Injectable({
  providedIn: 'root'
})
export class WeatherServService {
  public cities : CityWeatherData[] = [];

  constructor(public http: HttpClient) { }

  /* Adds an entierley new city and replaces an already existing one. */
  private AddCity( newCity: CityWeatherData ) : void {
    const existingCityIndex = this.cities.findIndex(currentCity => ( currentCity.cityName == newCity.cityName ));
    (existingCityIndex == -1) ? this.cities.push(newCity) : this.cities[existingCityIndex] = newCity;
  }

  public CityWeatherObservable( city:string ) : Observable<object> {
    const url : string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WeatherConstants.appApiKey}`;
    return this.http.get(url);
  }
}