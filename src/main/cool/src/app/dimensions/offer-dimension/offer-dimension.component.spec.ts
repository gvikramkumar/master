import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDimensionComponent } from './offer-dimension.component';

describe('OfferDimensionComponent', () => {
  let component: OfferDimensionComponent;
  let fixture: ComponentFixture<OfferDimensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDimensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
