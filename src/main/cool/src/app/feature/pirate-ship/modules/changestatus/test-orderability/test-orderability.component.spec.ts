import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrderabilityComponent } from './test-orderability.component';

describe('TestOrderabilityComponent', () => {
  let component: TestOrderabilityComponent;
  let fixture: ComponentFixture<TestOrderabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestOrderabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestOrderabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
