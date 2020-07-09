import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextEditorServiceService {

  constructor() { }

  public getTextEditElement() {
    var textWidget = document.createElement("button");
    textWidget.id = "textWidget";
    textWidget.innerHTML = "T";
    textWidget.className = "esri-widget esri-component";
    textWidget.style.padding = "7px 15px 5px";
    return textWidget;
  }
}
