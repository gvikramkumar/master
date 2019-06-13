import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferconstructChildComponent } from './offerconstruct-child.component';

describe('OfferconstructChildComponent', () => {
  let component: OfferconstructChildComponent;
  let fixture: ComponentFixture<OfferconstructChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferconstructChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferconstructChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
