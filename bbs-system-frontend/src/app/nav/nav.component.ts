import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // used to conditionally display certain elements.
  isLoggedIn: boolean = false;
  // locally stored, may be incorrect.
  username: string = "";

  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  ngOnInit() {
    // checks fields for accuracy when NavigationEnd event emitted.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.storage.retrieveToken() != null;
        this.username = this.storage.retrieveUsername();
      }
    })
  }

  logout() {
    // delete stored JWT to log out user.
    // stateless API, server does not store sessions.
    this.storage.deleteToken();
    this.isLoggedIn = false;  
    window.alert("Logged out.");
  }
}
