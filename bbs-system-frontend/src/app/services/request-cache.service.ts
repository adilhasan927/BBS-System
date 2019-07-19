import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {
  private cache = new Map<string, HttpResponse<any>>();

  constructor() { }

  get(req: HttpRequest<any>): HttpResponse<any> {
    if (req.urlWithParams in this.cache) {
      return this.cache[req.urlWithParams];
    } else{
      return null;
    }
  }

  set(req: HttpRequest<any>, response: HttpEvent<HttpResponse<any>>): void {
    this.cache[req.urlWithParams] = response;
  }

}
