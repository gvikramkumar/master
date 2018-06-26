import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmeasureComponent } from './submeasure.component';

describe('SubmeasureComponent', () => {
  let component: SubmeasureComponent;
  let fixture: ComponentFixture<SubmeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
