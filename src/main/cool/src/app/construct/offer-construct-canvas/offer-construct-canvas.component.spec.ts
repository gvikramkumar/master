import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferconstructCanvasComponent } from '@app/construct/offer-construct-canvas/offer-construct-canvas.component';

describe('OfferconstructCanvasComponent', () => {
  let component: OfferconstructCanvasComponent;
  let fixture: ComponentFixture<OfferconstructCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferconstructCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferconstructCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
