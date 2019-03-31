import { TestBed } from '@angular/core/testing';

import { OfferSolutioningValidatorService } from './offer-solutioning-validator.service';

describe('OfferSolutioningValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfferSolutioningValidatorService = TestBed.get(OfferSolutioningValidatorService);
    expect(service).toBeTruthy();
  });
});
