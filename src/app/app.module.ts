import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modules
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { CityWeatherCardCompComponent } from './components/city-weather-card-comp/city-weather-card-comp.component';
import { TextEditDialogCompComponent } from './components/text-edit-dialog-comp/text-edit-dialog-comp.component';
import { MapCompComponent } from './components/map-comp/map-comp.component';

@NgModule({
  declarations: [
    AppComponent,
    CityWeatherCardCompComponent,
    TextEditDialogCompComponent,
    MapCompComponent
  ],
  imports: [
    CommonModule, RouterModule,

    BrowserModule, BrowserAnimationsModule, AppRoutingModule, MatCheckboxModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatSlideToggleModule, HttpClientModule,
    ReactiveFormsModule, FormsModule, DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
