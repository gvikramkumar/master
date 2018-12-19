import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDimensionsComponent } from './delivery-dimensions.component';

describe('DeliveryDimensionsComponent', () => {
  let component: DeliveryDimensionsComponent;
  let fixture: ComponentFixture<DeliveryDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
