import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth-interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.get(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
