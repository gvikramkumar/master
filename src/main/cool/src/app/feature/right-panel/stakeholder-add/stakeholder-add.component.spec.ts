import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderAddComponent } from '@app/feature/stakeholder/stakeholder-add/stakeholder-add.component';

describe('StakeholderBottomViewComponent', () => {
  let component: StakeholderAddComponent;
  let fixture: ComponentFixture<StakeholderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
