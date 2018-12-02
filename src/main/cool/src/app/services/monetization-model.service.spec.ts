import { TestBed, inject } from '@angular/core/testing';

import { MonetizationModelService } from './monetization-model.service';

describe('MonetizationModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonetizationModelService]
    });
  });

  it('should be created', inject([MonetizationModelService], (service: MonetizationModelService) => {
    expect(service).toBeTruthy();
  }));
});
