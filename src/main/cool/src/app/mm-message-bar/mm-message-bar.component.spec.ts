import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmMessageBarComponent } from './mm-message-bar.component';

describe('MmMessageBarComponent', () => {
  let component: MmMessageBarComponent;
  let fixture: ComponentFixture<MmMessageBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmMessageBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmMessageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
