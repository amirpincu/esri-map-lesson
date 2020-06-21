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

  /* Returns a promise of a WeatherAPIResponseCod according to the response from a http request partaining to a given city name. */
  public RequestCityWeatherByName( city: string ) {
    return new Promise<WeatherAPIResponseCod>((resolve, reject) => {
      // format the url for the request
      const url : string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WeatherConstants.appApiKey}`;
      
      // The http get request: 
      // If a valid code was returned in the message the script of res will be executed.
      // If an error code was returned in the message the scripts of msg will be executed.
      this.http.get(url).toPromise().then(
        res => {
          // Creates a new city from the data then add it
          const newCity: CityWeatherData = {
            cityName: res['name'], 
            temp: res['main']['temp'], 
            maxTemp: res['main']['temp_max'],
            minTemp: res['main']['temp_min'], 
            weatherDesc: res['weather'][0]['icon']
          };
          this.AddCity(newCity);

          // send back a valid response
          resolve(WeatherAPIResponseCod.valid);
        },
        msg => {
          // An error message came back. As such I just need the code to find out what went wrong.
          // To understand how I extract the code, here is an object example:
          /*
          { headers: HttpHeaders,
            status: 404, 
            statusText: "Not Found", 
            url: "https://api.openweathermap.org/data/2.5/ …" }
          */

          // Getting the error-code to make code clear and save enum equivelent in variable.
          const errorCode = msg['status'];
          let errorType = WeatherAPIResponseCod.unknown;

          switch (errorCode) {
            case 401:
              errorType = WeatherAPIResponseCod.invalidApiKey; break;
            case 404:
              errorType = WeatherAPIResponseCod.cityNotFound; break;
            default:
              errorType = WeatherAPIResponseCod.unknown; break;
          }

          resolve(errorType);
          reject();
        }
      )
    });
  }
}