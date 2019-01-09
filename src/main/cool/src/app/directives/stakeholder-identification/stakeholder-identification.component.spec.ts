import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderIdentificationComponent } from './stakeholder-identification.component';

describe('StakeholderIdentificationComponent', () => {
  let component: StakeholderIdentificationComponent;
  let fixture: ComponentFixture<StakeholderIdentificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderIdentificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
