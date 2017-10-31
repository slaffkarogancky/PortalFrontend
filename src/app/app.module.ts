import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AdregServiceService } from './adreg-service.service';

import { AppComponent } from './app.component';
import { MapkoComponent } from './mapko/mapko.component';
import { NavbarkoComponent } from './navbarko/navbarko.component';

@NgModule({
  declarations: [
    AppComponent,
    MapkoComponent,
    NavbarkoComponent
  ],
  imports: [
    BrowserModule, HttpModule, FormsModule
  ],
  providers: [AdregServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
