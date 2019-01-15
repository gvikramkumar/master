import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferBasicInfoComponent } from './offer-basic-info.component';

describe('OfferBasicInfoComponent', () => {
  let component: OfferBasicInfoComponent;
  let fixture: ComponentFixture<OfferBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
