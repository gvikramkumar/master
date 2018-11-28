import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleDetailDialogComponent } from './generic-dialog.component';

describe('RuleDetailDialogComponent', () => {
  let component: RuleDetailDialogComponent;
  let fixture: ComponentFixture<RuleDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleDetailDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
