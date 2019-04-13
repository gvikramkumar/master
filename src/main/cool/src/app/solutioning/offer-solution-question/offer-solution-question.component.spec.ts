import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSolutionQuestionComponent } from './offer-solution-question.component';

describe('OfferSolutionQuestionComponent', () => {
  let component: OfferSolutionQuestionComponent;
  let fixture: ComponentFixture<OfferSolutionQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSolutionQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSolutionQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
