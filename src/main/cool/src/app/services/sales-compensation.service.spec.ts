import { TestBed } from '@angular/core/testing';

import { SalesCompensationService } from './sales-compensation.service';

describe('SalesCompensationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesCompensationService = TestBed.get(SalesCompensationService);
    expect(service).toBeTruthy();
  });
});
