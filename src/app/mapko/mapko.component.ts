import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as ol from 'openlayers';
import { AdregServiceService } from '../adreg-service.service';
import { LayerTypiko, LayerChangeEvent } from '../commons';

@Component({
  selector: 'mapko',
  templateUrl: './mapko.component.html',
  styleUrls: ['./mapko.component.css']
})
export class MapkoComponent implements OnInit {

  private map: ol.Map;
  private currentLayerType: LayerTypiko;

  @Output() onLayerLoaded = new EventEmitter<LayerChangeEvent>()

  constructor(private adregservice: AdregServiceService){}

  ngOnInit() {   
    this._initMap();
  }

  public showLayer(layerType: LayerTypiko, data: any){
    this._clearPopup();
    this.adregservice.loadLayer(layerType, data)
    .then(data => { this.currentLayerType = layerType; 
                    this._removerVectorLayers();
                    this.map.addLayer(data.layer);
                    this.onLayerLoaded.emit({ layerType: data.layerType, eventData: data.attributes});})
    .catch(error => alert(error));  
  }
  
  private _popup: ol.Overlay;
  private _closer: any;

  private _initMap(): void {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    this._closer = document.getElementById('popup-closer');
    this._popup = new ol.Overlay(({
      element : container,
      autoPan : true,
      autoPanAnimation : {
        duration : 250
      }
    }));
    this._closer.onclick = () => {
      this._clearPopup();
      return false;
    };
    this.map = new ol.Map({
        target : 'map',
        layers : [ new ol.layer.Tile({
            source : new ol.source.OSM()
        }) ],
        controls: ol.control.defaults({
            zoom: false
          }),
        overlays : [ this._popup ],
        loadTilesWhileAnimating : true,
        view : new ol.View({
            center : ol.proj.fromLonLat([ 36.30, 49.9884 ]),
            zoom : 12
        })
    });

    this.map.on('singleclick', evt => {
      this._clearPopup();
      const _feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
      });
      const detailInfo = this._getPopupInfo(this.currentLayerType, _feature);
      if (detailInfo){
        content.innerHTML = detailInfo;
        this._popup.setPosition(evt.coordinate);		
      }
    });
  }

  private _removerVectorLayers(): void{
    let layersArray = this.map.getLayers().getArray();
    layersArray.forEach(layer => {
      if ((layer instanceof ol.layer.Vector) || (layer instanceof ol.layer.Image)){
        this.map.removeLayer(layer);
      }
    });
  }

  private _clearPopup(){
    if (this._popup.getPosition){
      this._popup.setPosition(undefined);
      this._closer.blur();
    }    
  }
 
  private _addDetailRow(title: string, value: any){
    if (value){
      this._buffer += '<div class="detail-row"><span class="detail-title">'+title+': </span><span class="detail-value">'+ value +'</span></div>';
    }
  }

  private _buffer: string;

  private _getPopupInfo(layerType: LayerTypiko, feature: any){
    if (!feature) return null;    
    /*if (!(feature && feature.get('features').length === 1)) {
      return null;
    }  */
    let props = feature.getProperties();
    if (props.features){
      props = props.features[0].getProperties();
    }
    //const props = feature.getProperties().features[0].getProperties();
    this._buffer = "";
    if (layerType == LayerTypiko.ADVERTISE){
      this._addDetailRow("Заказчик", props.ctm);
      this._addDetailRow("Код заказчика", props.tx);	
      this._addDetailRow("E-mail", props.em);
      this._addDetailRow("Телефон", props.ph);
      this._addDetailRow("Адрес", props.adr);
      this._addDetailRow("Размер", props.sz);
      this._addDetailRow("№ разрешения", props.pm);
      this._addDetailRow("Дата разрешения", props.pmd);
    }
    else if (layerType == LayerTypiko.WEBDOCPROF){
      this._addDetailRow("Обращение", props.cn);
      this._addDetailRow("Дата обращения", props.cd);	
      if (props.tn) {
        this._buffer  += '<div class="detail-row"><span class="detail-title">Тематика: </span><span class="detail-value">('+ props.it + ') ' + props.tn +'</span></div>';
      }
    }
    else if (layerType == LayerTypiko.EDUCATION || layerType == LayerTypiko.MEDICINE || layerType == LayerTypiko.TRADE){
      this._addDetailRow("Описание", props.d);
    }
    else if (layerType == LayerTypiko.DUG){
      this._addDetailRow("Наименование работ", props.w);	
      this._addDetailRow("Тип работ", props.n);	      	
      this._addDetailRow("Заказчик работ", props.o);	
      this._addDetailRow("Адрес разрытия", props.a);	
      this._addDetailRow("Адрес пересечения", props.ad);
      this._addDetailRow("Площадь разрытия", props.v);
      this._addDetailRow("Дата начала работ", props.std);
      this._addDetailRow("Дата окончания работ", props.spd);
      this._addDetailRow("Номер разрешения", props.nr);	
      this._addDetailRow("Дата разрешения", props.rd);
    }
    return this._buffer;
  }

}
