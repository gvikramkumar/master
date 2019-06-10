import { TestBed } from '@angular/core/testing';

import { ChangestatusService } from './changestatus.service';

describe('ChangestatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangestatusService = TestBed.get(ChangestatusService);
    expect(service).toBeTruthy();
  });
});
