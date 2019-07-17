import { Injectable } from '@angular/core';
import * as _ from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storeToken(token: string) {
    localStorage.setItem('bbs-token', token);
    localStorage.setItem('username', _(token).username);
  }

  deleteToken() {
    localStorage.removeItem('bbs-token');
    localStorage.removeItem('username');

  }

  retrieveToken() {
    return localStorage.getItem('bbs-token');
  }
  
  retrieveUsername() {
    return localStorage.getItem('username');
  }

}
