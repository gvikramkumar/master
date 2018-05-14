import { TestBed, inject } from '@angular/core/testing';

import { BusinessUploadService } from './business-upload.service';

describe('BusinessUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessUploadService]
    });
  });

  it('should be created', inject([BusinessUploadService], (service: BusinessUploadService) => {
    expect(service).toBeTruthy();
  }));
});
