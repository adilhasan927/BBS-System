import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor{

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        next: val => {
          console.log(val);
        },
        error: error => {
          console.log(error);
          if (error.error == "TokenError") {
            this.router.navigate(['/login']);
            this.storage.deleteToken();
          } else if (error.error == "DBError") {
            console.log("DBError");
          }
        }
      })
    )
  }
}
