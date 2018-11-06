import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestValidationComponent } from './test-validation.component';

describe('TestValidationComponent', () => {
  let component: TestValidationComponent;
  let fixture: ComponentFixture<TestValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
