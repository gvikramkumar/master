import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagementAssignComponent } from './rule-management-assign.component';

describe('RuleManagementAssignComponent', () => {
  let component: RuleManagementAssignComponent;
  let fixture: ComponentFixture<RuleManagementAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleManagementAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleManagementAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
