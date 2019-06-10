import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsdlStatusTrackComponent } from './csdl-status-track.component';

describe('CsdlStatusTrackComponent', () => {
  let component: CsdlStatusTrackComponent;
  let fixture: ComponentFixture<CsdlStatusTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsdlStatusTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsdlStatusTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
