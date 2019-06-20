import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmInfoBarComponent } from './mm-info-bar.component';

describe('MmInfoBarComponent', () => {
  let component: MmInfoBarComponent;
  let fixture: ComponentFixture<MmInfoBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmInfoBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmInfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
