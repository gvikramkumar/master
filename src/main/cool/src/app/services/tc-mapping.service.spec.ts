import { TestBed } from '@angular/core/testing';

import { TcMappingService } from './tc-mapping.service';

describe('TcMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TcMappingService = TestBed.get(TcMappingService);
    expect(service).toBeTruthy();
  });
});
