import { Injectable } from '@angular/core';

export class mapStoreData {
  currentCoordinates: Array<number>;
  textSymbol: object;
}

const defaultValues: mapStoreData = {
  currentCoordinates: [ 31.92893, 34.5224 ],
  textSymbol: {
    type: 'text', // autocasts as new TextSymbol()
    color: '#eee',
    text: 'Sample',
    font: {
      // autocasts as new Font()
      size: 72,
      family: 'arial'
    },

    yoffset: -36,
    haloSize: 1,
    haloColor: 'rgba(0, 0, 0, 0.5)'
  }
};

@Injectable({
  providedIn: 'root'
})
export class MapStoreServiceService {
  private data: mapStoreData = defaultValues;

  constructor() { }

  // Coord
  public getCurrentCoordinates(): Array<Number> { return this.data.currentCoordinates; }
  public setCurrentCoordinates( lat: number, long: number ): void { this.data.currentCoordinates = [ lat, long ]; }

  // Text Symbol
  public getTextSymbol(): object { return this.data.textSymbol; }
  public setTextSymbol( newTextSymbol: object ): void { this.data.textSymbol = newTextSymbol; }
}
