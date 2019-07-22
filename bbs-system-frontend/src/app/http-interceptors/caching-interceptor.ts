import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { RequestCacheService  } from '../services/request-cache.service';
import { tap } from 'rxjs/operators';

/** Caches cacheable requests and returns cached responses if internet down. */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  constructor(private cache: RequestCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // pass request to next itnerceptor if not cachable.
    if (!this.isCachable(req)) { return next.handle(req); }
    const cachedResponse = this.cache.get(req);
    // return cached response if internet down.
    return (cachedResponse && !navigator.onLine) ?
      of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  // cache only HTTP GET requests.
  isCachable(req: HttpRequest<any>): boolean {
    if (req.method == 'GET') {
      return true;
    } else {
      return false;
    }
  }

  // send request and cache response.
  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCacheService
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        // There may be other events besides the response.
        if (event instanceof HttpResponse) {
          cache.set(req, event); // Update the cache.
        }
      })
    );
  }
}

