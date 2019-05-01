import { TestBed } from '@angular/core/testing';

import { ModellingDesignService } from './modelling-design.service';

describe('ModellingDesignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModellingDesignService = TestBed.get(ModellingDesignService);
    expect(service).toBeTruthy();
  });
});
