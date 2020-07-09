import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { Coordinate } from '../coordinate.model';

export class mapStoreData {
  currentCoordinates: Coordinate;
  textSymbol: object;
  showText: boolean;
  centerMapToCoordinate: Subject<Coordinate>;
}

const defaultValues: mapStoreData = {
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
  showText: false,
  centerMapToCoordinate: new Subject<Coordinate>()
};

@Injectable({
  providedIn: 'root'
})
export class MapStoreServiceService {
  private data: mapStoreData = defaultValues;

  constructor() { }

  // Coord
  public getCurrentCoordinates(): Coordinate { return this.data.currentCoordinates; }
  public setCurrentCoordinates( coord: Coordinate ): void { this.data.currentCoordinates = coord; }

  // Text Symbol
  public getTextSymbol(): object { return this.data.textSymbol; }
  public setTextSymbol( newTextSymbol: object ): void { this.data.textSymbol = newTextSymbol; }

  // Show Text Condition
  public getShowText(): boolean { return this.data.showText; }
  public setShowText( condition: boolean ): void { this.data.showText = condition; }

  // Center Map Action
  public onCenterSent(): Observable<Coordinate> { return this.data.centerMapToCoordinate.asObservable(); }
  public setCenterSent( newCenterCoord: Coordinate ): void { return this.data.centerMapToCoordinate.next(newCenterCoord); }
}
