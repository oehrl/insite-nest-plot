import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

// import { PlotlyViaCDNModule } from 'angular-plotly.js';
// PlotlyViaCDNModule.plotlyVersion = 'latest'; // can be `latest` or any version number (i.e.: '1.40.0')
// PlotlyViaCDNModule.plotlyBundle = 'basic'; // optional: can be null (for full) or 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'

import {
  MatCheckboxModule,
  MatInputModule,
  MatListModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InsiteNestPlotComponent } from './insite-nest-plot/insite-nest-plot.component';

@NgModule({
  declarations: [
    AppComponent,
    InsiteNestPlotComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatInputModule,
    MatListModule,
    PlotlyModule,
    // PlotlyViaCDNModule,
  ],
  exports: [
    MatCheckboxModule,
    MatInputModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
