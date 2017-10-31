import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarkoComponent } from './navbarko.component';

describe('NavbarkoComponent', () => {
  let component: NavbarkoComponent;
  let fixture: ComponentFixture<NavbarkoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarkoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
