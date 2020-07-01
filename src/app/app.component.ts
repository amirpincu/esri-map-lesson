import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeatherServService, WeatherAPIResponseCod } from './services/weather-service/weather-serv.service';
import { TextEditDialogCompComponent as TextEditDialogComponent } from './components/text-edit-dialog-comp/text-edit-dialog-comp.component';
import { CityWeatherData } from './services/city-weather.model';


import esri = __esri;
import { loadModules, loadScript } from 'esri-loader';
import { EventEmitter } from '@angular/core';
import { layer } from 'esri/views/3d/support/LayerPerformanceInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'weather-map-proj';
  
  // VARIABLES REALATED TO THE MAP
  // trying to get the symbol on load isnt possible so we keep a starting object
  keepTextSymbol: object = {
    type: 'text', // autocasts as new TextSymbol()
    color: '#eee',
    text: '',
    font: {
      // autocasts as new Font()
      size: 72,
      family: 'arial'
    },

    yoffset: -36,
    haloSize: 1,
    haloColor: 'rgba(0, 0, 0, 0.5)'
  };
  showTextEditor = false; // the variable deciding if the text editor shows.
  currCord = [ 0.000, 0.000 ]; // the currdinates are kept because click does not return the correct ones.

  // VARIABLES RELATED TO THE CITY WEATHER
  WeatherAPIResponseCod = WeatherAPIResponseCod;
  form: FormGroup = new FormGroup({ 'city': new FormControl( '', [ Validators.required, Validators.minLength(1) ]) });
  cities: CityWeatherData[] = [];
  map: esri.Map; mapView: esri.MapView;

  @ViewChild('mapViewNode', {static: true} ) public mapViewEl: ElementRef;

  public constructor(private weatherService: WeatherServService) { }

  public ngOnInit() {
    loadModules( 
      [ 
        // Map
        "esri/Map", 
        "esri/views/MapView", 
        // Layers
        "esri/layers/GraphicsLayer", 
        "esri/Graphic", 
        "esri/geometry/Point", 
        // Widgets
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

        // Widgets
        let compassWidget = new Compass( { view: mapView } );
        let searchWidget = new Search( { view: mapView } );
        mapView.ui.add( searchWidget, { position: "top-right", index: 1 } );
        mapView.ui.add( compassWidget, { position: "top-right", index: 2 } );
        
        // Custom widgets
        this.addCustomWidgets = this.addCustomWidgets.bind(this);
        this.addCustomWidgets(mapView);

        // The graphics layer
        const p = this.mapView.center;
        const g = new Graphic( { geometry: p, symbol: this.keepTextSymbol } );
        let gl = new GraphicsLayer({
          id: 'graphic-layer',
          graphics: [ g ]
        });
        map.add(gl);

        // On click function
        let f = function(obj) {
          if (this.showEditor) { // Only if the editor is on screen
            // Creating the new graphic
            const p = new Point({ x: obj.x, y: obj.y });
            const g = new Graphic({ geometry: new Point({ latitude: this.currCord[0], longitude: this.currCord[1] }), symbol: this.keepTextSymbol });
  
            // Replacing the existing graphic with a new one
            const graphics = map.findLayerById('graphic-layer').graphics;
            graphics.remove(graphics.items[0]);
            graphics.add(g);
          }
        };
        f = f.bind(this);
        this.mapView.on("click", f );
    })
    .catch( err => {
      console.error(err);
    });
  }

  public ngOnDestroy() { }

  // Activates every time a new symbol is sent.
  public updateSymbol(evt) {
    // Keeping the symbol and replacing the existing one with it

    this.keepTextSymbol = evt; // Needs to be kept for creating new graphics
    this.map.findLayerById('graphic-layer')['graphics']['items'][0]['symbol'] = (evt);
  }
  // Adds custom widgets to the map view
  private addCustomWidgets(mapView: esri.MapView) {
    // Widget 1- Coord Display
    {
      let coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "7px 15px 5px";

      mapView.ui.add(coordsWidget, "bottom-left");

      //*** ADD ***//
      let f = function showCoordinates(pt) {
        const coords = `Latitude : ${pt.latitude.toFixed(5)}° | Longitude : ${pt.longitude.toFixed(5)}°`;
        this.setCoords = this.setCoords.bind(this);
        this.setCoords( pt.latitude, pt.longitude );
        coordsWidget.innerHTML = coords;
      }
      f = f.bind(this);


      mapView.watch("stationary", function(isStationary) {
        f(mapView.center);
      });

      mapView.on("pointer-move", function(evt) {
        f(mapView.toMap({ x: evt.x, y: evt.y }));
      });
    }

    // Widget 2- Rotation Display
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

    // Widget 3- Zoom and Scale Display
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

    // Widget 4- Text Display
    {
      var textWidget = document.createElement("button");
      textWidget.id = "textWidget";
      textWidget.innerHTML = "Text Edit";
      textWidget.className = "esri-widget esri-component";
      textWidget.style.padding = "7px 15px 5px";
      this.showEditor = this.showEditor.bind(this);
      textWidget.onclick = this.showEditor;
      mapView.ui.add(textWidget, "top-right");
    }

  }

  // Both buttons the affect the text editor need to set the value to specific values so there's a need for both functions
  public showEditor() { this.showTextEditor = true; }
  public hideEditor() { this.showTextEditor = false; }

  // Sets the kept coordinates object
  public setCoords(lat: number, long: number) { this.currCord = [ lat, long ]; }


  // Functions relating to the city weather
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
