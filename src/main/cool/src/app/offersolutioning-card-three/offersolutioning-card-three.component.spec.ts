import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersolutioningCardThreeComponent } from './offersolutioning-card-three.component';

describe('OffersolutioningCardThreeComponent', () => {
  let component: OffersolutioningCardThreeComponent;
  let fixture: ComponentFixture<OffersolutioningCardThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersolutioningCardThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersolutioningCardThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
