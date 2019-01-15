import { TestBed, inject } from '@angular/core/testing';

import { ViewcommentService } from './viewcomment.service';

describe('ViewcommentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewcommentService]
    });
  });

  it('should be created', inject([ViewcommentService], (service: ViewcommentService) => {
    expect(service).toBeTruthy();
  }));
});
