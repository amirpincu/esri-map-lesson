import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeatherServService, WeatherAPIResponseCod } from './services/weather-serv.service';
import { CityWeatherData } from './services/city-weather.model';

import esri = __esri;
import { loadModules, loadScript } from 'esri-loader';
import { Point } from 'esri/geometry';

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
  public map: esri.Map; mapView: esri.MapView;

  public constructor(private weatherService: WeatherServService) { }

  public ngOnInit() {
    loadModules( 
      [ "esri/Map", 
        "esri/views/MapView", 
        "esri/layers/Layer", 
        "esri/layers/GraphicsLayer", 
        "esri/layers/FeatureLayer",
        "esri/Graphic", 
        "esri/geometry/Point", 
        "esri/geometry/Polyline",
        "esri/symbols/TextSymbol",
      
        "esri/widgets/Search",
        "esri/widgets/Compass"]
     ).then(
      ([EsriMap, EsriMapView, 
        Layer, GraphicsLayer, FeatureLayer, 
        Graphic, Point, Polyline, TextSymbol, 
        SearchWidget, Compass
      ]) => {
        
        // Setting Map and view
        const map = new EsriMap({
          // basemap: 'streets'
          basemap: 'hybrid'
        });
        this.map = map;

        const mapView = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [31.80772, 31.65674],
          zoom: 10,
          map: this.map
        });
        this.mapView = mapView;

        // Widgets
        this.addCustomWidgets(mapView);
        mapView.ui.add(
          new SearchWidget({ view: mapView }),
          { position: "top-right" }
        );
        mapView.ui.add(
          new Compass({ view: mapView }),
          { position: "top-right" }
        );

        // Layers
        const polyline = {
          type: "polyline",  // autocasts as new Polyline()
          paths: [
            [31.80772, 31.65674],
            [31.99772, 31.85674],
            [31.40772, 31.05674]
          ]
        };
        const polylineSymbol = {
          type: "simple-line",  // autocasts as SimpleLineSymbol()
          color: [255, 0, 0],
          width: 2
        };
        const polylineAtt = {
          Name: "Keystone Pipeline",
          Owner: "TransCanada"
        };
        const polylineGraphic = new Graphic({
          geometry: polyline,
          symbol: polylineSymbol,
          attributes: polylineAtt
        });
        console.log(polylineGraphic);

        // Label
        let textSymbol = {
          type: "text", // autocasts as new TextSymbol()
          angle: 90,
          color: "green",
          font: {
            // autocast as new Font()
            family: "Ariel",
            size: 12
          },
          haloColor: "black",
          haloSize: 1,
          horizontalAlignment: "justify",
          verticalAlignment: "bottom"
        };

        // Layers
        const graphics = [ new Point([31.80772, 31.65674]) ]
        const gl = new GraphicsLayer( { 'id': 'graphicsLayer', 'graphics': [polylineGraphic] } )
        const fl = new FeatureLayer({ 
          source: [ polylineGraphic ],
          fields: [{
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
          }, {
            name: "place",
            alias: "Place",
            type: "string"
          }],
          objectIdField: "ObjectID",
          geometryType: "polyline"
        });

        // map.layers.add( gl );
        map.layers.add( fl );
    })
    .catch( err => {
      console.error(err);
    });
  }

  public ngOnDestroy() { }

  private addCustomWidgets(mapView: esri.MapView) {
    // Widget 1- Coord Display
    {
      let coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "7px 15px 5px";

      mapView.ui.add(coordsWidget, "bottom-left");

      //*** ADD ***//
      function showCoordinates(pt) {
        const coords = `Latitude : ${pt.latitude.toFixed(5)}° | Longitude : ${pt.longitude.toFixed(5)}°` 
        coordsWidget.innerHTML = coords;
      }

      mapView.watch("stationary", function(isStationary) {
        showCoordinates(mapView.center);
      });

      mapView.on("pointer-move", function(evt) {
        showCoordinates(mapView.toMap({ x: evt.x, y: evt.y }));
      });
    }

    // Widget 3- Rotation Display
    {
      var rotationWidget = document.createElement("div");
      rotationWidget.id = "scaleZoomWidget";
      rotationWidget.className = "esri-widget esri-component";
      rotationWidget.style.padding = "7px 15px 5px";

      mapView.ui.add(rotationWidget, "bottom-right");

      //*** ADD ***//
      function showScaleZoom(pt) {
        const coords = `Rotation: ${(360 - Math.round(mapView.rotation)) % 360}°  (↻)`;
        rotationWidget.innerHTML = coords;
      }

      mapView.watch("stationary", function(isStationary) {
        showScaleZoom(mapView.center);
      });
    }

    // Widget 2- Zoom and Scale Display
    {
      var zoomScaleWidget = document.createElement("div");
      zoomScaleWidget.id = "scaleZoomWidget";
      zoomScaleWidget.className = "esri-widget esri-component";
      zoomScaleWidget.style.padding = "7px 15px 5px";

      mapView.ui.add(zoomScaleWidget, "bottom-right");

      //*** ADD ***//
      function showScaleZoom(pt) {
        const coords = `Zoom: ${mapView.zoom} | Scale of  1:${Math.round(mapView.scale)}`;
        zoomScaleWidget.innerHTML = coords;
      }

      mapView.watch("stationary", function(isStationary) {
        showScaleZoom(mapView.center);
      });
    }

  }

  private AddCityToList( newCity: CityWeatherData ) : void {
    const existingCityIndex = this.cities.findIndex(currentCity => ( currentCity.cityName == newCity.cityName ));
    (existingCityIndex == -1) ? this.cities.push(newCity) : this.cities[existingCityIndex] = newCity;
    this.showPlace( {'lat': newCity.lat, 'long': newCity.long} );
  }

  public searchCity(): void {
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

  public showPlace(coord: object): void {
    this.mapView.goTo([coord['long'], coord['lat']])
  }
}
