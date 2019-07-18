import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private token: StorageService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (this.token.retrieveToken()) {
      return true;
    } else {
      window.setTimeout(window.alert, 0, "You must log in or sign up first.")
      return this.router.createUrlTree(['/login']);
    }
  }
}
