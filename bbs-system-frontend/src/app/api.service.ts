import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Credentials } from './credentials';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Response } from './response';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private queryURL: string = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) { }

  login(credentials: Credentials): Observable<Response> {
    const url = this.queryURL + '/login';
    return this.http.post<Response>(url, JSON.stringify(credentials), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  signup(credentials: Credentials, captchaResponse: string): Observable<Response> {
    const url = this.queryURL + '/signup';
    return this.http.post<Response>(url, JSON.stringify({
      credentials: credentials,
      captchaResponse: captchaResponse,
    }), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  post(token:string, body:string): Observable<Response> {
    const url = this.queryURL + '/post';
    return this.http.post<Response>(url, JSON.stringify({
      AuthToken: token,
      body: body,
    }), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getContent(position: number = 0): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'AuthToken': this.storage.retrieveToken(),
        'position': position.toString(),
      }),
    };
    const url = this.queryURL + '/post';
    return this.http.get<Response>(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  comment(token: string, postID: string, body:string): Observable<Response> {
    const url = this.queryURL + '/comment';
    return this.http.post<Response>(url, JSON.stringify({
      AuthToken: token,
      PostID: postID,
      body: body,
    }), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getComments(postID: string, position: number = 0): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'AuthToken': this.storage.retrieveToken(),
        'PostID': postID,
        'position': position.toString(),
      }),
    };
    const url = this.queryURL + '/comment';
    return this.http.get<Response>(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProfile(username: string): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'AuthToken': this.storage.retrieveToken(),
      }),
      params: {
        username: username,
      },
    }
    const url = this.queryURL + '/profile';
    return this.http.get<Response>(url, httpOptions);
  }

  editProfile(token: string, profileText: string): Observable<Response> {
    const url = this.queryURL + '/profile';
    return this.http.post<Response>(url, JSON.stringify({
      AuthToken: token,
      profile: profileText,
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
