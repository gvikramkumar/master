import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignReviewComponent } from '@app/design-review/design-review.component';

describe('DesignReviewComponent', () => {
  let component: DesignReviewComponent;
  let fixture: ComponentFixture<DesignReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
