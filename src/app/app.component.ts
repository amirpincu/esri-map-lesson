import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeatherServService, WeatherAPIResponseCod } from './services/weather-service/weather-serv.service';
import { TextEditDialogCompComponent as TextEditDialogComponent } from './components/text-edit-dialog-comp/text-edit-dialog-comp.component';
import { CityWeatherData } from './services/city-weather.model';


import esri = __esri;
import { loadModules, loadScript } from 'esri-loader';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'weather-map-proj'; WeatherAPIResponseCod = WeatherAPIResponseCod;
  
  form: FormGroup = new FormGroup({ 'city': new FormControl( '', [ Validators.required ]) });
  showTextEditor = true;

  cities: CityWeatherData[] = [];
  map: esri.Map; mapView: esri.MapView;

  @ViewChild('mapViewNode', {static: true} ) public mapViewEl: ElementRef;
  @ViewChild('textEditor', {static: true} ) public textEditor: TextEditDialogComponent;

  public constructor(private weatherService: WeatherServService) { }

  public ngOnInit() {
    loadModules( 
      [ "esri/Map", 
        "esri/views/MapView", 

        "esri/layers/GraphicsLayer", 
        "esri/Graphic", 
        "esri/geometry/Point", 
      
        "esri/widgets/Search",
        "esri/widgets/Compass" ]
     ).then(
      ( [
        EsriMap, EsriMapView, 
        GraphicsLayer, 
        Graphic, Point,
        Search, Compass
      ] ) => {
        
        // Setting Map and view
        let map = new EsriMap({
          // basemap: 'streets'
          basemap: 'hybrid'
        }); this.map = map;

        let mapView = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [ 31.92893, 34.5224 ],
          zoom: 7,
          map: map
        }); this.mapView = mapView;
        this.mapView.on("click", this.addGraphic)

        // Widgets
        let compassWidget = new Compass( { view: mapView } );
        let searchWidget = new Search( { view: mapView } );
        mapView.ui.add( searchWidget, { position: "top-right", index: 1 } );
        mapView.ui.add( compassWidget, { position: "top-right", index: 2 } );
        this.addCustomWidgets(mapView);

        // Layers
        const p = new Point({ latitude: 31.94893, longitude: 34.5224 });
        const textSymbol = {
          type: "text", // autocasts as new TextSymbol()
          color: "#FF0000",
          text: "Yoyoyoyo",
          haloSize: 1,
          haloColor: "#000",
          font: {
            // autocasts as new Font()
            size: 36,
            family: "arial"
          }
        };
        const g = new Graphic({
          geometry: p,
          symbol: textSymbol
        });

        const gl = new GraphicsLayer({
          graphics: [ g ]
        });
        map.add(gl);

    })
    .catch( err => {
      console.error(err);
    });
  }

  public addGraphic(obj) {
    try {
      console.log("a");
      this.textEditor?.emitSendSymbol();
    } catch (e) { console.log("e") }
  }

  public ngOnDestroy() { }

  public addNewText(obj): void {
    console.log(obj);
  }

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

  public hideEditor() {
    this.showTextEditor = false;
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
