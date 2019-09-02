import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingDateInputComponent } from './processing-date-input.component';

describe('ProcessingDateInputComponent', () => {
  let component: ProcessingDateInputComponent;
  let fixture: ComponentFixture<ProcessingDateInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingDateInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
