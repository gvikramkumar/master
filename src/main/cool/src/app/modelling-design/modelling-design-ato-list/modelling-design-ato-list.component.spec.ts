import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellingDesignAtoListComponent } from './modelling-design-ato-list.component';

describe('ModellingDesignAtoListComponent', () => {
  let component: ModellingDesignAtoListComponent;
  let fixture: ComponentFixture<ModellingDesignAtoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModellingDesignAtoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModellingDesignAtoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
