import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMappingComponent } from './service-mapping.component';

describe('ServiceMappingComponent', () => {
  let component: ServiceMappingComponent;
  let fixture: ComponentFixture<ServiceMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
