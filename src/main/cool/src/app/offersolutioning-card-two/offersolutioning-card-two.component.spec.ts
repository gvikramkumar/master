import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersolutioningCardTwoComponent } from './offersolutioning-card-two.component';

describe('OffersolutioningCardTwoComponent', () => {
  let component: OffersolutioningCardTwoComponent;
  let fixture: ComponentFixture<OffersolutioningCardTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersolutioningCardTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersolutioningCardTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
