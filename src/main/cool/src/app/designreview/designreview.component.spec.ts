import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignreviewComponent } from './designreview.component';

describe('DesignreviewComponent', () => {
  let component: DesignreviewComponent;
  let fixture: ComponentFixture<DesignreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
