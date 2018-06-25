import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmeasureEditComponent } from './submeasure-edit.component';

describe('SubmeasureEditComponent', () => {
  let component: SubmeasureEditComponent;
  let fixture: ComponentFixture<SubmeasureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmeasureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmeasureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
