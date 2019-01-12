import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSolutioningComponent } from './offer-solutioning.component';

describe('OfferSolutioningComponent', () => {
  let component: OfferSolutioningComponent;
  let fixture: ComponentFixture<OfferSolutioningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSolutioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSolutioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
