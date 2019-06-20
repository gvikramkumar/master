import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SapAtoSummaryComponent } from './sap-ato-summary.component';

describe('SapAtoSummaryComponent', () => {
  let component: SapAtoSummaryComponent;
  let fixture: ComponentFixture<SapAtoSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SapAtoSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SapAtoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
