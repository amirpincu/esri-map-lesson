import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modules
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    CommonModule, RouterModule,

    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    MatInputModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatSlideToggleModule, HttpClientModule,
    ReactiveFormsModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }