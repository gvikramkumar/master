import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoStatusComponent } from './ato-status.component';

describe('AtoStatusComponent', () => {
  let component: AtoStatusComponent;
  let fixture: ComponentFixture<AtoStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
