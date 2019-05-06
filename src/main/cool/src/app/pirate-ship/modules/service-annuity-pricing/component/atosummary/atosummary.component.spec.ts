import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ATOSummaryComponent } from './atosummary.component';

describe('ATOSummaryComponent', () => {
  let component: ATOSummaryComponent;
  let fixture: ComponentFixture<ATOSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ATOSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATOSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
