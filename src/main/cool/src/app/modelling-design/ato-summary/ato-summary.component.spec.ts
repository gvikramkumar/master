import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoSummaryComponent } from './ato-summary.component';

describe('AtoSummaryComponent', () => {
  let component: AtoSummaryComponent;
  let fixture: ComponentFixture<AtoSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
