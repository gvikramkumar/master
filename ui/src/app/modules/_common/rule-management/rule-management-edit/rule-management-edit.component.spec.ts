import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagementEditComponent } from './rule-management-edit.component';

xdescribe('RuleManagementEditComponent', () => {
  let component: RuleManagementEditComponent;
  let fixture: ComponentFixture<RuleManagementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleManagementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
