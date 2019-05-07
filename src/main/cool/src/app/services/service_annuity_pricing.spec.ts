import { TestBed } from '@angular/core/testing';

import { ServiceAnnuityPricingService } from './service_annuity_pricing.service';

describe('ServiceAnnuityPricingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceAnnuityPricingService = TestBed.get(ServiceAnnuityPricingService);
    expect(service).toBeTruthy();
  });
});
