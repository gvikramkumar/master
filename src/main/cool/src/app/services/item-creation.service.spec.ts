import { TestBed } from '@angular/core/testing';

import { ItemCreationService } from './item-creation.service';

describe('ItemCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemCreationService = TestBed.get(ItemCreationService);
    expect(service).toBeTruthy();
  });
});
