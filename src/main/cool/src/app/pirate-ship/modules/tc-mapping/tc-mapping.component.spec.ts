import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcMappingComponent } from './tc-mapping.component';

describe('TcMappingComponent', () => {
  let component: TcMappingComponent;
  let fixture: ComponentFixture<TcMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
