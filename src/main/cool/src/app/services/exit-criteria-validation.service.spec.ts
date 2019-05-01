import { TestBed, inject } from '@angular/core/testing';

import { ExitCriteriaValidationService } from './exit-criteria-validation.service';

describe('ExitCriteriaValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitCriteriaValidationService]
    });
  });

  it('should be created', inject([ExitCriteriaValidationService], (service: ExitCriteriaValidationService) => {
    expect(service).toBeTruthy();
  }));
});
