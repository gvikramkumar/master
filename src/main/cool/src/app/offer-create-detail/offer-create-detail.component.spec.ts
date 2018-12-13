import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCreateDetailComponent } from './offer-create-detail.component';

describe('OfferCreateDetailComponent', () => {
  let component: OfferCreateDetailComponent;
  let fixture: ComponentFixture<OfferCreateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferCreateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCreateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
