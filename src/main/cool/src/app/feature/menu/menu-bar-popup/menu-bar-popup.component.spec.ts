import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBarPopupComponent } from './menu-bar-popup.component';

describe('MenuBarPopupComponent', () => {
  let component: MenuBarPopupComponent;
  let fixture: ComponentFixture<MenuBarPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuBarPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
