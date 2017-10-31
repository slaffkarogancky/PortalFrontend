import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs';
import * as ol from 'openlayers';
import {LayerTypiko, LayerInfoResult} from './commons';


@Injectable()
export class AdregServiceService {

  constructor(private http: Http) { 
    this._initializeConfiguration();
  }  

  public loadLayer(layerType: LayerTypiko, input: any){
    if (layerType == LayerTypiko.ADVERTISE){
      return this._loadData(layerType, this.ADVERTIZE_URL, input, null, this._advertLayerHandler);
    }
    else if (layerType == LayerTypiko.WEBDOCPROF){
      input.eventData.daysAgo = input.eventData.daysAgo > 31 ? 31 : input.eventData.daysAgo; 
      const today: Date = this._getDate(0);
      const _32DaysAgo: Date = this._getDate(32);
      const params: string = '?from=' + this._formatDate(_32DaysAgo) + '&to=' + this._formatDate(today);
      return this._loadData(layerType, this.DOCPROF_URL + params, input, null, this._docprofLayerHandler);
    }
    else {
      return this._loadData(layerType, this.CITY_INFRASTRUCTURE_URL, input, this._filterInfrastructureCache, this._infrastructureLayerHandler);
    }
  }

  private readonly ADVERTIZE_URL: string = 'http://10.0.0.22:2018/portal/api/v1/advertize';
  
  private readonly DOCPROF_URL: string = 'http://10.0.0.22:2018/portal/api/v1/docprof'; 

  private CITY_INFRASTRUCTURE_URL: string = 'http://cdr.citynet.kharkov.ua/webaccesspoints/Home/loadFeatures';

  
  private readonly _configuration: Map<LayerTypiko, any> = new Map<LayerTypiko, any>();

  private _createConfiguration(datacache: any[], color: string, iconUrl: string) {
    return {
      dataCache: datacache,
      styleCache: {},
      icon: new ol.style.Style({image: new ol.style.Icon({src: iconUrl})}),
      mainColor: color
    }
  }

  private _initializeConfiguration(){
    this._configuration.set(LayerTypiko.ADVERTISE, this._createConfiguration([], '#32CD32', "./assets/images/green-single.png"));
    this._configuration.set(LayerTypiko.WEBDOCPROF, this._createConfiguration([], '#1E90FF', "./assets/images/blue-single.png"));
    const commonCache = [];
    this._configuration.set(LayerTypiko.MEDICINE, this._createConfiguration(commonCache, '#FA8072', "./assets/images/red-single.png"));
    this._configuration.set(LayerTypiko.EDUCATION, this._createConfiguration(commonCache, '#FF8C00', "./assets/images/yellow-single.png"));
    this._configuration.set(LayerTypiko.TRADE, this._createConfiguration(commonCache, '#00BFFF', "./assets/images/light-blue-single.png"));
  }

  private _getStyle(layerType: LayerTypiko, feature: any): any {    
    const currConfig = this._configuration.get(layerType);
    const size = feature.get('features').length;
    if (size === 1){
      return currConfig.icon;
    }									
    let style = currConfig.styleCache[size];
    if (!style) {									
      let _radius = 10, _fill = currConfig.mainColor;
      if (size > 100) {_radius = 40}
      if (size > 70) {_radius = 32}
      if (size > 50) {_radius = 24}
      if (size > 5) {_radius = 16}	
      style = new ol.style.Style({
        image : new ol.style.Circle({
          radius : _radius,
          stroke : new ol.style.Stroke({color : '#fff'}),
          fill : new ol.style.Fill({color : _fill})
        }),
        text : new ol.style.Text({
          text : size.toString(),
          fill : new ol.style.Fill({color : '#fff'})
        })
      });
      currConfig.styleCache[size] = style;
    }
    return style;
  }

  private _createClusteredLayer(layerType: LayerTypiko, currfeatures: any[]): ol.layer.Vector{
    const vectorSource = new ol.source.Vector({
      features: currfeatures
    });
    const clusterSource = new ol.source.Cluster({
      distance: 20,
      source: vectorSource 
    });
    return new ol.layer.Vector({
      source : clusterSource,
      style : feature => {        
        return this._getStyle(layerType, feature);
      }
    });
  }
  
  private _cacheGeojsonData(res: Response, cache: any) {
    const body = res.json();
    body.features.forEach((item, index) => {
      let coords = new ol.geom.Point(ol.proj.transform(item.geometry.coordinates, 'EPSG:4326', 'EPSG:3857'));
      let feature: ol.Feature = new ol.Feature(coords);
      item.properties.i_d_ = index;  
      feature.setProperties(item.properties);
      cache.push(feature);
    });    
  }

  private _loadData(layerType: LayerTypiko, url: string, input: any, afterLoad: (() => void), layerHandler: ((x) => LayerInfoResult)){
    const cache = this._configuration.get(layerType).dataCache;
    if (cache.length !== 0){
      const result: LayerInfoResult = layerHandler.bind(this)(input);
      return Promise.resolve(result);
    }
    else { 
      return this.http.get(url)
                      .toPromise()
                      .then((data) => { this._cacheGeojsonData(data, cache); 
                                        if (afterLoad){
                                          afterLoad.bind(this)();
                                        }
                                        const result: LayerInfoResult = layerHandler.bind(this)(input);
                                        return result; })
                      .catch(this._handlePromiseError);
    }
  }

  private _advertLayerHandler(input: any) : LayerInfoResult{
    const count = [0, 0, 0, 0, 0];
    const filter = [input.eventData.a, input.eventData.b, input.eventData.c, input.eventData.d, input.eventData.e];
    const bufferok = [];
    const adregCache = this._configuration.get(LayerTypiko.ADVERTISE).dataCache;
    adregCache.forEach(feature => {  const gt = feature.getProperties().gt;
                                           count[gt]++;
                                           if (filter[gt]){
                                              bufferok.push(feature);
                                  }});
    return {
      layer: this._createClusteredLayer(LayerTypiko.ADVERTISE, bufferok),
      layerType: LayerTypiko.ADVERTISE,    
      attributes: { a: count[0], b: count[1], c: count[2], d: count[3], e: count[4] }
    };
  }

  private _docprofLayerHandler(input: any) : LayerInfoResult{
    const today = this._getDate(0).getTime(); 
    const sevenDaysAgo = this._getDate(7).getTime();
    const thirstyDaysAgo = this._getDate(30).getTime();
    const fromTime = this._getDate(input.eventData.daysAgo).getTime(); 
    const bufferok = [];
    const attributes = { daysAgo: input.eventData.daysAgo, 
      count: 0, 
      todayCount: 0,
      sevenDaysAgoCount: 0, 
      thirstyDaysAgoCount: 0};  
    const webdocprofCache = this._configuration.get(LayerTypiko.WEBDOCPROF).dataCache;
    webdocprofCache.forEach(feature => {  
      const cd =  feature.getProperties().cd;
      const featureDate = this._parseDate(cd).getTime();
      if (featureDate >= today) {
        attributes.todayCount++;
      }
      if (featureDate >= sevenDaysAgo) {
        attributes.sevenDaysAgoCount++;
      }
      if (featureDate >= thirstyDaysAgo) {
        attributes.thirstyDaysAgoCount++;
      }
      if (featureDate >= fromTime){
         bufferok.push(feature);
         attributes.count++;
      }
    });
    return {
      layer: this._createClusteredLayer(LayerTypiko.WEBDOCPROF, bufferok),
      layerType: LayerTypiko.WEBDOCPROF,    
      attributes: attributes
    };
  }

  private _filterInfrastructureCache(){
    const infrastructureCache = this._configuration.get(LayerTypiko.MEDICINE).dataCache;
    const temporarybufer: any[] = [];
    infrastructureCache.forEach(feature => {
      const gt = feature.getProperties();
      if (gt.i > 3000) return;
      if (gt.t != 3) return;
      if (gt.c == 1 ||  gt.c == 2 ||  gt.c == 6) temporarybufer.push(feature); 
    });
    this._configuration.get(LayerTypiko.MEDICINE).dataCache = temporarybufer;
  }

  private _infrastructureLayerHandler(input: any) : LayerInfoResult{
    const currentLayerType: LayerTypiko = input.layerType;
    const infrastructureCache = this._configuration.get(LayerTypiko.MEDICINE).dataCache;
    const count = [0, 0, 0, 0];
    const filter = [input.eventData.a, input.eventData.b, input.eventData.c, input.eventData.d];
    const bufferok = [];
    let patterns = [];
    let featureTypeId = 0;
    if (currentLayerType == LayerTypiko.MEDICINE){
      patterns = [["аптека"], ["больница"], ["поликлиника"]];
      featureTypeId = 1;
    }
    else if (currentLayerType == LayerTypiko.EDUCATION){
      patterns = [["школа", "гимназия", "лицей"], ["дошкольн"], ["библиотека"]]; 
      featureTypeId = 2;
    }
    else if (currentLayerType == LayerTypiko.TRADE){
      patterns = [["супермаркет"], ["магазин"], ["рынок"]]; 
      featureTypeId = 6;
    }    
    infrastructureCache.forEach(feature => {          
      const props = feature.getProperties();
      if (props.c !== featureTypeId) return;
      const desc: string = props.d.toLowerCase();
      if (this._containString(desc, patterns[0])) {count[0]++; if (filter[0]) bufferok.push(feature)}
      else if (this._containString(desc, patterns[1])) {count[1]++; if (filter[1]) bufferok.push(feature)}
      else if (this._containString(desc, patterns[2])) {count[2]++; if (filter[2]) bufferok.push(feature)}
      else {count[3]++; if (filter[3]) bufferok.push(feature)};
    });
    return {
      layer: this._createClusteredLayer(currentLayerType, bufferok),
      layerType: currentLayerType,    
      attributes: { a: count[0], b: count[1], c: count[2], d: count[3] }
    };
  }

  private _handlePromiseError (error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }	

  private _parseDate(source: string){
    const day = source.substr(0, 2);
    const month = source.substr(3, 2);
    const year = source.substr(6, 4);
    return new Date(+year, +month - 1, +day);
  }

  private _containString(source: string, pattern: string|any): boolean{
    if (pattern instanceof Array){
      let result = false;
      pattern.forEach(item => {
        if (source.indexOf(item) >= 0){
          result = true;
        }        
      });
      return result;
    }
    else 
      return source.indexOf(pattern) >= 0;
  }
  
  private _formatDate(date: Date): string{    
    let day = date.getDate();
    let result: string = day < 10 ? '0' + day : '' + day;
    result += '-';
    let month = date.getMonth() + 1; // getMonth() получить месяц, от 0 до 11
    result += month < 10 ? '0' + month : month;
    result += '-';
    result += date.getFullYear();
    return result;
  }
  
  private _getDate(dayAgo: number): Date{
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    if (dayAgo == 0){
      return today;
    }
    const res: Date = new Date();
    res.setDate(today.getDate() - dayAgo);
    res.setHours(0, 0, 0, 0);
    return res;
  }
}
