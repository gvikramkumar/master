import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmeasureAddComponent } from './submeasure-add.component';

describe('SubmeasureAddComponent', () => {
  let component: SubmeasureAddComponent;
  let fixture: ComponentFixture<SubmeasureAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmeasureAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmeasureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
