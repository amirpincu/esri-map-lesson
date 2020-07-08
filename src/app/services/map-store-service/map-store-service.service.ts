import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { Coordinate } from '../coordinate.model';

export class mapStoreData {
  view: object;
  currentCoordinates: Coordinate;
  textSymbol: object;
  centerMapToCoordinate: Subject<Coordinate>;
}

const defaultValues: mapStoreData = {
  view: undefined,
  currentCoordinates: { latitude: 31.92893, longitude: 34.5224 },
  textSymbol: {
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
  },
  centerMapToCoordinate: new Subject<Coordinate>()
};

@Injectable({
  providedIn: 'root'
})
export class MapStoreServiceService {
  private data: mapStoreData = defaultValues;

  constructor() { }

  // View
  public setView( view: object ): void { this.data.view = view; }
  public getView( view: object ): any { return this.data.view; }

  // Coord
  public getCurrentCoordinates(): Coordinate { return this.data.currentCoordinates; }
  public setCurrentCoordinates( coord: Coordinate ): void { this.data.currentCoordinates = coord; console.log(coord) }

  // Text Symbol
  public getTextSymbol(): object { return this.data.textSymbol; }
  public setTextSymbol( newTextSymbol: object ): void { this.data.textSymbol = newTextSymbol; }

  // Center Map Action
  public onCenterSent(): Observable<Coordinate> { return this.data.centerMapToCoordinate.asObservable(); }
  public setCenterSent( newCenterCoord: Coordinate ): void { return this.data.centerMapToCoordinate.next(newCenterCoord); }
}
