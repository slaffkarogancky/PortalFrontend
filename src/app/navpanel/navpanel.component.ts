import { Component, EventEmitter, Output,  ElementRef, OnInit } from '@angular/core';
import { LayerTypiko, LayerChangeEvent } from '../commons';

@Component({
  selector: 'navpanel',
  templateUrl: './navpanel.component.html',
  styleUrls: ['./navpanel.component.css']
})
export class NavpanelComponent {
    
    interaction : boolean = false;
    
    @Output() ontocListBtnClick = new EventEmitter<boolean>();
    @Output() onZoomToFullExtentClick = new EventEmitter<boolean>();  
    @Output() onMeasureBtnClick = new EventEmitter<boolean>();  

  private navpanelCl(e):void{
    var elID = e.currentTarget.id;
    switch(elID){
      case "tocListBtn":{
        this.ontocListBtnClick.emit(true);
        break;
      }
      case "zoomToFullBtn":{
        this.onZoomToFullExtentClick.emit(true);
        break;
      }
      case "measureBtn":{        
        this.interaction = !this.interaction;    
        this.onMeasureBtnClick.emit(this.interaction);    
        break;
      }
      // case "feedbackBtn":{
      //   this.onFeedbackBtnClick.emit(true);            
      //   break;
      // }
      // case "helpBtn":{
      //   break;
      // }
      default:
      break;      
    }
  }

  private 
}