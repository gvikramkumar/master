import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfferCoolComponent } from './create-offer-cool.component';

describe('CreateOfferCoolComponent', () => {
  let component: CreateOfferCoolComponent;
  let fixture: ComponentFixture<CreateOfferCoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOfferCoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOfferCoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
