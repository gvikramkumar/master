import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmAssesmentComponent } from './mm-assesment.component';

describe('MmAssesmentComponent', () => {
  let component: MmAssesmentComponent;
  let fixture: ComponentFixture<MmAssesmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmAssesmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
