import { TestBed } from '@angular/core/testing';

import { OfferSetupService } from './offer-setup.service';

describe('OfferSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfferSetupService = TestBed.get(OfferSetupService);
    expect(service).toBeTruthy();
  });
});
