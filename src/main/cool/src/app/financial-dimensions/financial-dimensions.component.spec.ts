import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDimensionsComponent } from './financial-dimensions.component';

describe('FinancialDimensionsComponent', () => {
  let component: FinancialDimensionsComponent;
  let fixture: ComponentFixture<FinancialDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
