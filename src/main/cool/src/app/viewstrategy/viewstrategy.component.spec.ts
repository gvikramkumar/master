import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewstrategyComponent } from './viewstrategy.component';

describe('ViewstrategyComponent', () => {
  let component: ViewstrategyComponent;
  let fixture: ComponentFixture<ViewstrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewstrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewstrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
