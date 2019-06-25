import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuiGenericModalComponent } from './cui-genric-modal.component';

describe('CuiGenricModalComponent', () => {
  let component: CuiGenericModalComponent;
  let fixture: ComponentFixture<CuiGenericModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuiGenericModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuiGenericModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
