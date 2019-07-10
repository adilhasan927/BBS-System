import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = "";

  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.storage.retrieveToken() != null;
        this.username = this.storage.retrieveUsername();
      }
    })
  }

  logout() {
    this.storage.deleteToken();
    this.storage.deleteUsername();
    this.isLoggedIn = false;  
    window.alert("Logged out.");
  }
}
