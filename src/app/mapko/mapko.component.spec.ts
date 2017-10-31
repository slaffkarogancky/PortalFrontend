import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapkoComponent } from './mapko.component';

describe('MapkoComponent', () => {
  let component: MapkoComponent;
  let fixture: ComponentFixture<MapkoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapkoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
