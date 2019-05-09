import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoStatusComponent } from './sso-status.component';

describe('SsoStatusComponent', () => {
  let component: SsoStatusComponent;
  let fixture: ComponentFixture<SsoStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
