import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagementCreateComponent } from './rule-management-create.component';

describe('RuleManagementCreateComponent', () => {
  let component: RuleManagementCreateComponent;
  let fixture: ComponentFixture<RuleManagementCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleManagementCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleManagementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
