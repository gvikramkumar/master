import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSetupComponent } from './offer-setup.component';

describe('OfferSetupComponent', () => {
  let component: OfferSetupComponent;
  let fixture: ComponentFixture<OfferSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
