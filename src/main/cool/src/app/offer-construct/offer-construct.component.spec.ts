import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferConstructComponent } from './offer-construct.component';

describe('OfferConstructComponent', () => {
  let component: OfferConstructComponent;
  let fixture: ComponentFixture<OfferConstructComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferConstructComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferConstructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
