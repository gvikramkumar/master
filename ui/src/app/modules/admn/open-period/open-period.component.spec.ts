import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPeriodComponent } from './open-period.component';

xdescribe('OpenPeriodComponent', () => {
  let component: OpenPeriodComponent;
  let fixture: ComponentFixture<OpenPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
