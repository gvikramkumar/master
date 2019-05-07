import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServiceOrderabilityComponent } from './self-service-orderability.component';

describe('SelfServiceOrderabilityComponent', () => {
  let component: SelfServiceOrderabilityComponent;
  let fixture: ComponentFixture<SelfServiceOrderabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfServiceOrderabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfServiceOrderabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
