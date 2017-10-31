import * as ol from 'openlayers';

export enum LayerTypiko {
    ADVERTISE, 
    WEBDOCPROF,
    MEDICINE,
    EDUCATION,
    TRADE
}

export interface LayerChangeEvent {
    layerType: LayerTypiko,    
    eventData: any
}

export interface LayerInfoResult {
    layerType: LayerTypiko,    
    attributes: any   
    layer: ol.layer.Vector
}



