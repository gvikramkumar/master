import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellingDesignAtoComponent } from './modelling-design-ato.component';

describe('ModellingDesignAtoComponent', () => {
  let component: ModellingDesignAtoComponent;
  let fixture: ComponentFixture<ModellingDesignAtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModellingDesignAtoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModellingDesignAtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
