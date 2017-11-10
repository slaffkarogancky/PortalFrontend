import { Component, OnInit, EventEmitter, Output, ElementRef} from '@angular/core';
import { LayerTypiko, LayerChangeEvent } from '../commons';

@Component({
  selector: 'navbarko',
  templateUrl: './navbarko.component.html',
  styleUrls: ['./navbarko.component.css']
})
export class NavbarkoComponent implements OnInit {


  private title: string = "Внешняя реклама";

  private advertValues = ["-", "-", "-", "-", "-", "-", "-"];
  private advertCheckboxes = [true, true, true, true, true, true, true];

  private medicineValues = ["-", "-", "-", "-", "-", "-", "-"];
  private medicineCheckboxes = [true, true, true, true, true, true, true];

  private educationValues = ["-", "-", "-", "-", "-", "-", "-"];
  private educationCheckboxes = [true, true, true, true, true, true, true];

  private tradeValues = ["-", "-", "-", "-", "-", "-", "-"];
  private tradeCheckboxes = [true, true, true, true, true, true, true];

  private dugValues = ["-", "-", "-", "-", "-", "-", "-"];
  private dugCheckboxes = [true, true, true, true, true, true, true];

  private selectedDocProf = "seven";

  private docprof_now = "-" //за сегодня
  private docprof_7 = "-" //за 7 дней
  private docprof_30 = "-" //за 30 дней

  private layerType: LayerTypiko = LayerTypiko.ADVERTISE;

  @Output() onNavbarLayerChange = new EventEmitter<LayerChangeEvent>()

  ngOnInit() {
  }

  constructor(private detailes:ElementRef) { }

  public updateStatistic(event: LayerChangeEvent){
    if (event.layerType == LayerTypiko.WEBDOCPROF){
      this.docprof_now = event.eventData.todayCount.toString(); 
      this.docprof_7 = event.eventData.sevenDaysAgoCount.toString(); 
      this.docprof_30 = event.eventData.thirstyDaysAgoCount.toString(); 
      return;
    }
    let currentValues;
    if (event.layerType == LayerTypiko.ADVERTISE) currentValues = this.advertValues; 
    if (event.layerType == LayerTypiko.MEDICINE) currentValues = this.medicineValues; 
    if (event.layerType == LayerTypiko.EDUCATION) currentValues = this.educationValues; 
    if (event.layerType == LayerTypiko.TRADE) currentValues = this.tradeValues; 
    if (event.layerType == LayerTypiko.DUG) currentValues = this.dugValues;
    currentValues[0] = (event.eventData.a) ? event.eventData.a.toString() : "-"; 
    currentValues[1] = (event.eventData.b) ? event.eventData.b.toString() : "-"; 
    currentValues[2] = (event.eventData.c) ? event.eventData.c.toString() : "-"; 
    currentValues[3] = (event.eventData.d) ? event.eventData.d.toString() : "-"; 
    currentValues[4] = (event.eventData.e) ? event.eventData.e.toString() : "-"; 
    currentValues[5] = (event.eventData.f) ? event.eventData.f.toString() : "-"; 
    currentValues[6] = (event.eventData.g) ? event.eventData.g.toString() : "-"; 
  }

  private _update(title: string, layerType : LayerTypiko, controls: any[]){
    this.title = title;
    this.layerType = layerType;
    this.onNavbarLayerChange.emit({ layerType: layerType, 
      eventData: {
        a: controls[0],
        b: controls[1],
        c: controls[2], 
        d: controls[3],
        e: controls[4],
        f: controls[5],
        g: controls[6]
      }})
  }

  private updateAdvert(): void {
    this._update("Внешняя реклама", LayerTypiko.ADVERTISE, this.advertCheckboxes);
  }

  private updateEducation(): void {
    this._update("Образование", LayerTypiko.EDUCATION, this.educationCheckboxes);
  }

  private updateTrade(): void {
    this._update("Торговля", LayerTypiko.TRADE, this.tradeCheckboxes);
  }

  private updateMedicine(): void {
    this._update("Медицина", LayerTypiko.MEDICINE, this.medicineCheckboxes);
  }

  private updateDug(): void {
    this._update("Разрытия", LayerTypiko.DUG, this.dugCheckboxes);
  }

  private updateDocProf(value): void {
    this.title = "Обращения граждан";
    this.layerType = LayerTypiko.WEBDOCPROF;
    let daysago = 0;
    if (this.selectedDocProf === "today"){
      daysago = 0;
    }
    if (this.selectedDocProf === "seven"){
      daysago = 7; 
    }
    if (this.selectedDocProf === "thirsty"){
      daysago = 30;
    }
    this.onNavbarLayerChange.emit({ layerType: LayerTypiko.WEBDOCPROF, 
      eventData: {
        daysAgo: daysago
    }})
  }
  
  private _isAdvertActive(): boolean{
    return this.layerType == LayerTypiko.ADVERTISE;
  }

  private _isDocprofActive(): boolean{
    return this.layerType == LayerTypiko.WEBDOCPROF;
  }

  private _isMedicineActive(): boolean{
    return this.layerType == LayerTypiko.MEDICINE;
  }

  private _isEducationActive(): boolean{
    return this.layerType == LayerTypiko.EDUCATION;
  }
  
  private _isTradeActive(): boolean{
    return this.layerType == LayerTypiko.TRADE;
  }

  private _isDugActive(): boolean{
    return this.layerType == LayerTypiko.DUG;
  }
 
  public toggleDetailes():void{
      var dWidth = this.detailes.nativeElement.querySelector('div.details').style.display;
     // (dWidth == "none" || dWidth == "")? this.detailes.nativeElement.querySelector('div.details').style.display="block" : this.detailes.nativeElement.querySelector('div.details').style.display="none";
      // if (dWidth == "none" || dWidth == "")
      //   this.detailes.nativeElement.querySelector('div.details').style.display="block";
      // else
      //   this.detailes.nativeElement.querySelector('div.details').style.display="none";
  }
}
