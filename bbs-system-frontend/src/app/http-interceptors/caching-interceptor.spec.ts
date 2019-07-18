import { TestBed } from '@angular/core/testing';

import { CachingInterceptor } from './caching-interceptor';

describe('CachingInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const interceptor: CachingInterceptor = TestBed.get(CachingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
