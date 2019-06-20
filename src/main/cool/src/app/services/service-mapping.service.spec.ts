import { TestBed } from '@angular/core/testing';

import { ServiceMappingService } from './service-mapping.service';

describe('ServiceMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceMappingService = TestBed.get(ServiceMappingService);
    expect(service).toBeTruthy();
  });
});
