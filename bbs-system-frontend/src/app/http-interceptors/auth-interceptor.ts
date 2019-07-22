import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { StorageService  } from '../services/storage.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private storage: StorageService) { }
  interceptables = [
    ["localhost:3000/api/email", 'POST'],
    ["localhost:3000/api/signup", 'POST'],
    ["localhost:3000/api/login", 'POST']
  ]

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var authReq;
    if (this.interceptable(req)) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${this.storage.retrieveToken()}` }
      })
    } else {
      authReq = req;
    }
    return next.handle(authReq);
  }

  interceptable(req: HttpRequest<any>) {
    const pathname = req.url.split('/').slice(2).join('/');
    for (const i of this.interceptables) {
      if (pathname == i[0] && req.method == i[1]) {
        return false;
      }
    }
    return true;
  }

}

