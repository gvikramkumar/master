import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoAtoSummaryComponent } from './sso-ato-summary.component';

describe('SsoAtoSummaryComponent', () => {
  let component: SsoAtoSummaryComponent;
  let fixture: ComponentFixture<SsoAtoSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoAtoSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoAtoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
