import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitCriteriaValidationComponent } from './exit-criteria-validation.component';

describe('ExitCriteriaValidationComponent', () => {
  let component: ExitCriteriaValidationComponent;
  let fixture: ComponentFixture<ExitCriteriaValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitCriteriaValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitCriteriaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
