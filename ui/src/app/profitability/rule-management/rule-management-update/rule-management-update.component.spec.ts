import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagementUpdateComponent } from './rule-management-update.component';

describe('RuleManagementAssignComponent', () => {
  let component: RuleManagementUpdateComponent;
  let fixture: ComponentFixture<RuleManagementUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleManagementUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleManagementUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
