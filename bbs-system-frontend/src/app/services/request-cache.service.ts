import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {
  private cache = new Map<string, HttpResponse<Response>>();

  constructor() { }

  get(req: HttpRequest<Response>): HttpResponse<Response> {
    if (req.urlWithParams in this.cache) {
      return this.cache[req.urlWithParams];
    } else{
      return null;
    }
  }

  set(req: HttpRequest<Response>, response: HttpEvent<HttpResponse<Response>>): void {
    this.cache[req.urlWithParams] = response;
  }

}
