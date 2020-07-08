import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeatherServService, WeatherAPIResponseCod } from './services/weather-service/weather-serv.service';
import { CityWeatherData } from './services/city-weather.model';
import { Coordinate } from './services/coordinate.model';


import esri = __esri;
import { loadModules, loadScript } from 'esri-loader';
import { EventEmitter } from '@angular/core';
import { layer } from 'esri/views/3d/support/LayerPerformanceInfo';
import { MapStoreServiceService } from './services/map-store-service/map-store-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'weather-map-proj';

  // VARIABLES RELATED TO THE CITY WEATHER
  WeatherAPIResponseCod = WeatherAPIResponseCod;
  form: FormGroup = new FormGroup({ 'city': new FormControl( '', [ Validators.required, Validators.minLength(1) ]) });
  cities: CityWeatherData[] = [];

  public constructor(private weatherService: WeatherServService, private mapStore: MapStoreServiceService) { }

  public ngOnInit() { }

  public ngOnDestroy() { }

  // Functions relating to the city weather
  private AddCityToList( newCity: CityWeatherData ) : void {
    const existingCityIndex = this.cities.findIndex(currentCity => ( currentCity.cityName == newCity.cityName ));
    (existingCityIndex == -1) ? this.cities.push(newCity) : this.cities[existingCityIndex] = newCity;
    this.ShowPlace( { latitude: newCity.lat, longitude: newCity.long } );
  }
  public SearchCity(): void {
    if (this.form.valid) {
      const cityName: string = this.form.controls['city'].value;

      this.weatherService.CityWeatherObservable(cityName).subscribe(
        // A normal response
        (res) => {
          // Creates a new city from the data then add it
          const newCity: CityWeatherData = {
            cityName: res['name'], 
            temp: res['main']['temp'], 
            maxTemp: res['main']['temp_max'],
            minTemp: res['main']['temp_min'], 
            weatherDesc: res['weather'][0]['icon'],
            lat: res['coord']['lat'], long: res['coord']['lon']
          };
  
          this.AddCityToList(newCity);
        },
  
        // An Error
        (err) => {
          // An error message came back. As such I just need the code to find out what went wrong.
            // To understand how I extract the code, here is an object example:
            /*
            { headers: HttpHeaders,
              status: 404, 
              statusText: "Not Found", 
              url: "https://api.openweathermap.org/data/2.5/ …" }
            */
  
            // Getting the error-code to make code clear and save enum equivelent in variable.
            const errorCode = err['status'];
            let errorType = WeatherAPIResponseCod.unknown;
  
            switch (errorCode) { 
              case 401:
                alert(`The API key currently used is now invalid. please renew it.`); break;
              case 404:
                alert(`The city '${cityName}' was not found within the service's database.`); break;
              default:
                alert(`Unknown error occoured, please try again.`); break;
            }
        },
  
        // Stream completed
        () => {
          console.log('http rest completed.');
        }
      );
    }
  }
  public ShowPlace( coord: Coordinate ) { this.mapStore.setCenterSent(coord); }
}
