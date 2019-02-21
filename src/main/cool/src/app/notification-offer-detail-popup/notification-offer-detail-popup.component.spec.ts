import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOfferDetailPopupComponent } from './notification-offer-detail-popup.component';

describe('NotificationOfferDetailPopupComponent', () => {
  let component: NotificationOfferDetailPopupComponent;
  let fixture: ComponentFixture<NotificationOfferDetailPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationOfferDetailPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationOfferDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
