import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { MapStoreServiceService } from 'src/app/services/map-store-service/map-store-service.service';
import { Subscription } from 'rxjs';
import { Coordinate } from '../../services/coordinate.model';
import { ThrowStmt } from '@angular/compiler';
import { NgElement, WithProperties } from '@angular/elements'
import { start } from 'repl';
import { TextShowWidget } from '../text-show-widget/text-show-widget.component';
import { coordinateSegments } from 'esri/widgets/CoordinateConversion/support/Format';

declare global {
  interface HTMLElementTagNameMap {
    'text-show-widget': NgElement & WithProperties<{}>;
  }
}

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
        "esri/widgets/Compass",
        "esri/widgets/CoordinateConversion",
        "esri/widgets/DistanceMeasurement2D",
        "esri/widgets/ScaleBar"
      ]
     ).then(
      ( [
        EsriMap, EsriMapView, 
        GraphicsLayer, 
        Graphic, Point,
        Search, Compass, CoordinateConversion, DistanceMeasurement2D, ScaleBar
      ] ) => {

        //    MAP
        let map = new EsriMap({
          basemap: 'hybrid'
        }); this.map = map;

        //    VIEW
        const startingCenter = this.mapStore.getCurrentCoordinates();
        let mapView = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [ startingCenter.latitude, startingCenter.longitude ],
          zoom: 7,
          map: map
        }); 
        this.mapView = mapView;

        //    UPDATING THE HOVER COORDINATES
        let updateHoverCoordinates = function showCoordinates(pt) {
          this.mapStore.setCurrentCoordinates( { latitude: pt.latitude, longitude: pt.longitude } );
        }
        updateHoverCoordinates = updateHoverCoordinates.bind(this); // Allows the function to access mapStore
        mapView.watch( "stationary", function(isStationary) { updateHoverCoordinates(mapView.center); } );
        mapView.on( "pointer-move", function(evt) { updateHoverCoordinates(mapView.toMap({ x: evt.x, y: evt.y })); } );

        //  Widgets
        let compassWidget = new Compass( { view: mapView } );
        let searchWidget = new Search( { view: mapView } );
        let coordinateConversionWidget = new CoordinateConversion( { view: mapView } );
        let distanceMeasurement2D = new DistanceMeasurement2D( { view: mapView } );
        let scaleBar = new ScaleBar( { view: mapView } );
        mapView.ui.add( searchWidget, { position: "top-right", index: 1 } );
        mapView.ui.add( compassWidget, { position: "top-right", index: 2 } );
        mapView.ui.add( coordinateConversionWidget, { position: "bottom-left", index: 1 });
        mapView.ui.add( distanceMeasurement2D, { position: "bottom-right", index: 1 });
        mapView.ui.add( scaleBar, { position: "top-left", index: 0 });

        // Custom widgets
        this.addTextEditWidget = this.addTextEditWidget.bind(this);
        this.addTextEditWidget(mapView);

        //  The graphics layer
        const p = this.mapView.center;
        let symbol = this.mapStore.getTextSymbol();
        const g = new Graphic( { geometry: p, symbol: symbol } );
        let gl = new GraphicsLayer({
          id: 'graphic-layer',
          graphics: [ g ]
        });
        map.add(gl);

        //  On click function
        let onMapClick = function(obj) {
          if (this.showTextEditor) { // Only if the editor is on screen
            //  Creating the new graphic
            const currCoord = this.mapStore.getCurrentCoordinates();
            const g = new Graphic({ 
              geometry: new Point( { latitude: currCoord.latitude, longitude: currCoord.longitude } ), 
              symbol: this.mapStore.getTextSymbol()
            });
  
            // Replacing the existing graphic with a new one
            const graphics = map.findLayerById('graphic-layer').graphics;
            graphics.remove(graphics.items[0]);
            graphics.add(g);
          }
        };
        onMapClick = onMapClick.bind(this);
        this.mapView.on("click", onMapClick );

        this.showPlaceSubscription();
    })
    .catch( err => { console.error(err); } );
  }

  // Adds custom widgets to the map view
  private addTextEditWidget(mapView: esri.MapView) {

    let textShowWidget = document.createElement("text-show-widget");
    textShowWidget.id = "textShowWidget";
    textShowWidget.appendChild(new TextShowWidget(this.mapStore));
    mapView.ui.add(textShowWidget, { position: "top-right", index: 3 });

  }

  // Activates every time a new symbol is sent.
  public updateSymbol() { 
    this.map.findLayerById('graphic-layer')['graphics'].items[0].symbol = this.mapStore.getTextSymbol();
  }
  
  // Both buttons the affect the text editor need to set the value to specific values so there's a need for both functions
  public showEditor() { 
    this.showTextEditor = true;
  }
  public hideEditor() {
    this.showTextEditor = false;
  }

  // Start a subsription that centers the map upon coordinates being recieved
  public showPlaceSubscription(): void {
      this.mapStore.onCenterSent().subscribe(
        (coord) => {
          this.mapView.goTo([ coord.longitude, coord.latitude ])
        },
        (err) => {
          console.error(err);
        }
      );
  }

}
