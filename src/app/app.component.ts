import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeatherServService, WeatherAPIResponseCod } from './services/weather-serv.service';
import { CityWeatherData } from './services/city-weather.model';

import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'weather-map-proj'; WeatherAPIResponseCod = WeatherAPIResponseCod;
  form: FormGroup = new FormGroup({ 'city': new FormControl( '', [ Validators.required ]) });

  @ViewChild('mapViewNode') mapViewEl: ElementRef;

  public cities: CityWeatherData[] = [];
  public map: any; mapView: any;

  public constructor(private weatherService: WeatherServService) {}
  public ngOnInit() {
    loadModules( 
      ['esri/Map', 'esri/views/MapView'],
     ).then(
      ([EsriMap, EsriMapView]) => {
        // Setting Map and view
        const map = new EsriMap({
          basemap: 'streets'
        });
        this.map = map;

        const mapView = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [32.08, 34.8],
          zoom: 10,
          map: this.map
        });
        this.mapView = mapView;

        console.log(this.map);
        console.log(this.mapView);

        this.addWidgets();
    })
    .catch( err => {
      console.error(err);
    });
  }
  public ngOnDestroy() { }

  private addWidgets() {
    // Widget 1- Coord Shower
    var coordsWidget = document.createElement("div");
    coordsWidget.id = "coordsWidget";
    coordsWidget.className = "esri-widget esri-component";
    coordsWidget.style.padding = "7px 15px 5px";

    this.mapView.ui.add(coordsWidget, "bottom-right");

    //*** ADD ***//
    function showCoordinates(pt) {
      var coords = "Lat/Lon " + pt.latitude.toFixed(6) + " " 
        + pt.longitude.toFixed(6) + " | Scale 1:" 
        + Math.round(this.mapView.scale * 1) / 1 
        + " | Zoom " + this.mapView.zoom;
      coordsWidget.innerHTML = coords;
    }

    this.mapView.watch("stationary", function(isStationary) {
      showCoordinates(this.mapView.center);
    });

    this.mapView.on("pointer-move", function(evt) {
      showCoordinates(this.mapView.toMap({ x: evt.x, y: evt.y }));
    });
  }

  private AddCityToList( newCity: CityWeatherData ) : void {
    const existingCityIndex = this.cities.findIndex(currentCity => ( currentCity.cityName == newCity.cityName ));
    (existingCityIndex == -1) ? this.cities.push(newCity) : this.cities[existingCityIndex] = newCity;
  }

  public searchCity() {
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

  public showPlace(coord: Array<number>): void {
    this.mapView.
    console.log(coord);
  }
}
