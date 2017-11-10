import * as ol from 'openlayers';

export enum LayerTypiko {
    ADVERTISE, 
    WEBDOCPROF,
    MEDICINE,
    EDUCATION,
    TRADE,
    DUG
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



