import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailViewComponent } from './offer-detail-view.component';

describe('OfferDetailViewComponent', () => {
  let component: OfferDetailViewComponent;
  let fixture: ComponentFixture<OfferDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
