import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Credentials } from './credentials';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private queryURL: string = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  login(credentials: Credentials): Observable<AuthResponse> {
    const url = this.queryURL + '/login';
    return this.http.post<AuthResponse>(url, JSON.stringify(credentials), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  signup(credentials: Credentials): Observable<AuthResponse> {
    const url = this.queryURL + '/signup';
    return this.http.post<AuthResponse>(url, JSON.stringify(credentials), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(token) {
    const url = this.queryURL + '/logout';
    return this.http.post(url, JSON.stringify({ token: token }), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  post(token, body): Observable<AuthResponse> {
    const url = this.queryURL + '/submit-post';
    return this.http.post<AuthResponse>(url, JSON.stringify({
      AuthToken: token,
      body: body,
    }), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  
}
