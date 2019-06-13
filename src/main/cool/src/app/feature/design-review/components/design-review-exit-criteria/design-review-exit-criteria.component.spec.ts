import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignReviewExitCriteriaComponent } from './design-review-exit-criteria.component';

describe('DesignReviewExitCriteriaComponent', () => {
  let component: DesignReviewExitCriteriaComponent;
  let fixture: ComponentFixture<DesignReviewExitCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignReviewExitCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignReviewExitCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
