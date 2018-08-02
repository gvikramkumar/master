import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureEditComponent } from './measure-edit.component';

describe('MeasureEditComponent', () => {
  let component: MeasureEditComponent;
  let fixture: ComponentFixture<MeasureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
