import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagementComponent } from './rule-management.component';

describe('RuleManagementComponent', () => {
  let component: RuleManagementComponent;
  let fixture: ComponentFixture<RuleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
