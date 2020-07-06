import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { MapStoreServiceService } from 'src/app/services/map-store-service/map-store-service.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'map-comp',
  templateUrl: './map-comp.component.html',
  styleUrls: ['./map-comp.component.scss']
})
export class MapCompComponent implements OnInit {
  // VARIABLES REALATED TO THE MAP
  map: esri.Map; mapView: esri.MapView;
  showTextEditor = false; // the variable deciding if the text editor shows.

  @ViewChild('mapViewNode', {static: true} ) public mapViewEl: ElementRef;

  constructor(private mapStore: MapStoreServiceService) { }

  ngOnInit(): void {
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
          center: this.mapStore.getCurrentCoordinates(),
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
        const g = new Graphic( { geometry: p, symbol: this.mapStore.getTextSymbol() } );
        let gl = new GraphicsLayer({
          id: 'graphic-layer',
          graphics: [ g ]
        });
        map.add(gl);

        // On click function
        let f = function(obj) {
          if (this.showTextEditor) { // Only if the editor is on screen
            // Creating the new graphic
            const g = new Graphic({ 
              geometry: new Point(
                {
                  latitude: this.mapStore.getCurrentCoordinates()[0], 
                  longitude: this.mapStore.getCurrentCoordinates()[1] }
              ), 
              symbol: this.mapStore.getTextSymbol() });
  
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

    // Activates every time a new symbol is sent.
    public updateSymbol() {
      this.map.findLayerById('graphic-layer')['graphics'].items[0].symbol = this.mapStore.getTextSymbol();
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
          this.mapStore.setCurrentCoordinates( pt.latitude, pt.longitude );
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

    public showPlace(coord: object): void {
      this.mapView.goTo([coord['long'], coord['lat']])
    }

}
