import { Injectable } from '@angular/core';
import * as _ from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storeToken(token: string) {
    sessionStorage.setItem('bbs-token', token);
    sessionStorage.setItem('username', _(token).username);
  }

  deleteToken() {
    sessionStorage.removeItem('bbs-token');
    sessionStorage.removeItem('username');

  }

  retrieveToken() {
    return sessionStorage.getItem('bbs-token');
  }
  
  retrieveUsername() {
    return sessionStorage.getItem('username');
  }

}
