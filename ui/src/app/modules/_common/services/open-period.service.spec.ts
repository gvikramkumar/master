import { TestBed, inject } from '@angular/core/testing';

import { OpenPeriodService } from './open-period.service';

describe('OpenPeriodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenPeriodService]
    });
  });

  it('should be created', inject([OpenPeriodService], (service: OpenPeriodService) => {
    expect(service).toBeTruthy();
  }));
});
