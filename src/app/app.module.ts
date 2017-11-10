import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AdregServiceService } from './adreg-service.service';

import { AppComponent } from './app.component';
import { MapkoComponent } from './mapko/mapko.component';
import { NavbarkoComponent } from './navbarko/navbarko.component';
import { ApComponent } from './ap/ap.component';
import { NavpanelComponent } from './navpanel/navpanel.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    MapkoComponent,
    NavbarkoComponent,
    ApComponent,
    NavpanelComponent,
    FeedbackComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule, HttpModule, FormsModule
  ],
  providers: [AdregServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
