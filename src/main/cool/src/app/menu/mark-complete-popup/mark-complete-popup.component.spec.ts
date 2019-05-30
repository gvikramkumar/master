import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkCompletePopupComponent } from './mark-complete-popup.component';

describe('MarkCompletePopupComponent', () => {
  let component: MarkCompletePopupComponent;
  let fixture: ComponentFixture<MarkCompletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkCompletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkCompletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
