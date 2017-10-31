import { Component, OnInit,  EventEmitter, Output, ViewChild } from '@angular/core';
import { AdregServiceService } from './adreg-service.service';
import { LayerTypiko, LayerChangeEvent } from './commons';
import { NavbarkoComponent } from './navbarko/navbarko.component';
import { MapkoComponent } from './mapko/mapko.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @ViewChild(NavbarkoComponent)   
  private _navbar: NavbarkoComponent; 

  @ViewChild(MapkoComponent)   
  private _map: MapkoComponent; 

  ngAfterViewInit(){
    this._map.showLayer(LayerTypiko.ADVERTISE, { eventData : {a: true, b: true, c: true, d: true, e: true}});
  }

  private onLayerMapLoaded(event): void { // type of event is LayerChangeEvent
    this._navbar.updateStatistic(event);
  }

  private onNavbarLayerChanged(event): void { // type of event is LayerChangeEvent
    this._map.showLayer(event.layerType, event);
  }
  
}
