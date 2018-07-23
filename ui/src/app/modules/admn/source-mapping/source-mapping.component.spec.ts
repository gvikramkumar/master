import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceMappingComponent } from './source-mapping.component';

describe('SourceMappingComponent', () => {
  let component: SourceMappingComponent;
  let fixture: ComponentFixture<SourceMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
