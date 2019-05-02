import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellingDesignComponent } from './modelling-design.component';

describe('ModellingDesignComponent', () => {
  let component: ModellingDesignComponent;
  let fixture: ComponentFixture<ModellingDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModellingDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModellingDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
