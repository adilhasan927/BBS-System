import { TestBed } from '@angular/core/testing';

import { FetchContentService } from './fetch-content.service';

describe('FetchContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FetchContentService = TestBed.get(FetchContentService);
    expect(service).toBeTruthy();
  });
});
