import { TestBed } from '@angular/core/testing';

import { OfferconstructCanvasService } from './offerconstruct-canvas.service';

describe('OfferconstructCanvasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfferconstructCanvasService = TestBed.get(OfferconstructCanvasService);
    expect(service).toBeTruthy();
  });
});
