import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingDimensionsComponent } from './pricing-dimensions.component';

describe('PricingDimensionsComponent', () => {
  let component: PricingDimensionsComponent;
  let fixture: ComponentFixture<PricingDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
