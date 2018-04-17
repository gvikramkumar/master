import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmeasureUploadComponent } from './submeasure-upload.component';

describe('SubmeasureUploadComponent', () => {
  let component: SubmeasureUploadComponent;
  let fixture: ComponentFixture<SubmeasureUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmeasureUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmeasureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
