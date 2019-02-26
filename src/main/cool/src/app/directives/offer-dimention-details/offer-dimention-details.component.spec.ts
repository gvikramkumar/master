import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDimentionDetailsComponent } from './offer-dimention-details.component';

describe('OfferDimentionDetailsComponent', () => {
  let component: OfferDimentionDetailsComponent;
  let fixture: ComponentFixture<OfferDimentionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDimentionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDimentionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
