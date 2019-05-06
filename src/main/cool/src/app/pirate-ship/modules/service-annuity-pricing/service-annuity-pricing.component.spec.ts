import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAnnuityPricingComponent } from './service-annuity-pricing.component';

describe('ServiceAnnuityPricingComponent', () => {
  let component: ServiceAnnuityPricingComponent;
  let fixture: ComponentFixture<ServiceAnnuityPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAnnuityPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAnnuityPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
