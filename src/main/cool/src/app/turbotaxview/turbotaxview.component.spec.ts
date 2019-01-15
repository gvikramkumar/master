import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurbotaxviewComponent } from './turbotaxview.component';

describe('TurbotaxviewComponent', () => {
  let component: TurbotaxviewComponent;
  let fixture: ComponentFixture<TurbotaxviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurbotaxviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurbotaxviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
