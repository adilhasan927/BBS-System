import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Tab } from '../models/tab';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean = false;
  tabs: Array<Tab> = [];
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
        this.tabs = this.storage.getTabs();
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

  deleteTab(tab: Tab) {
    this.router.navigate(['/posts', 'main.main']);
    this.storage.deleteTab(tab);
    this.tabs = this.storage.getTabs();
  }

}
