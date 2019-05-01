import { TestBed } from '@angular/core/testing';

import { OffersolutioningService } from './offersolutioning.service';

describe('OffersolutioningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffersolutioningService = TestBed.get(OffersolutioningService);
    expect(service).toBeTruthy();
  });
});
