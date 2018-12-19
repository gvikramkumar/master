import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDimensionsComponent } from './offer-dimensions.component';

describe('OfferDimensionsComponent', () => {
  let component: OfferDimensionsComponent;
  let fixture: ComponentFixture<OfferDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
