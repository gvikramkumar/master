import { TestBed } from '@angular/core/testing';

import { SelfServiceOrderabilityService } from './self-service-orderability.service';

describe('SelfServiceOrderabilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelfServiceOrderabilityService = TestBed.get(SelfServiceOrderabilityService);
    expect(service).toBeTruthy();
  });
});
