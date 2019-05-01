import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderFullComponent } from './stakeholder-full.component';

describe('StakeholderFullComponent', () => {
  let component: StakeholderFullComponent;
  let fixture: ComponentFixture<StakeholderFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
