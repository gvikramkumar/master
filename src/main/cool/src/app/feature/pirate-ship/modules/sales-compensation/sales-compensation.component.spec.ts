import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCompensationComponent } from './sales-compensation.component';

describe('SalesCompensationComponent', () => {
  let component: SalesCompensationComponent;
  let fixture: ComponentFixture<SalesCompensationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCompensationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
