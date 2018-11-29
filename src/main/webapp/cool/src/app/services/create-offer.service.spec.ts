import { TestBed, inject } from '@angular/core/testing';

import { CreateOfferService } from './create-offer.service';

describe('CreateOfferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateOfferService]
    });
  });

  it('should be created', inject([CreateOfferService], (service: CreateOfferService) => {
    expect(service).toBeTruthy();
  }));
});
