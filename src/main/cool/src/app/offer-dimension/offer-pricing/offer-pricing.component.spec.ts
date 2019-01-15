import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPricingComponent } from './offer-pricing.component';

describe('OfferPricingComponent', () => {
  let component: OfferPricingComponent;
  let fixture: ComponentFixture<OfferPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
