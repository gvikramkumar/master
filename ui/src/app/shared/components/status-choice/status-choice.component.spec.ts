import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusChoiceComponent } from './status-choice.component';

describe('StatusChoiceComponent', () => {
  let component: StatusChoiceComponent;
  let fixture: ComponentFixture<StatusChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
