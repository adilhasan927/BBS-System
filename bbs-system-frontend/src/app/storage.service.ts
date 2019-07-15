import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storeToken(token: string) {
    sessionStorage.setItem('bbs-token', token);
  }

  deleteToken() {
    sessionStorage.removeItem('bbs-token');
  }

  retrieveToken() {
    return sessionStorage.getItem('bbs-token');
  }
}
