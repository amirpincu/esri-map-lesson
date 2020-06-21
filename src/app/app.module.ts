import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CityWeatherCardCompComponent } from './components/city-weather-card-comp/city-weather-card-comp.component';
import { TextEditDialogCompComponent } from './components/text-edit-dialog-comp/text-edit-dialog-comp.component';

@NgModule({
  declarations: [
    AppComponent,
    CityWeatherCardCompComponent,
    TextEditDialogCompComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
