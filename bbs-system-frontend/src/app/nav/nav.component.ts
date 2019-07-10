import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean;
  username: string;

  constructor(
    private storage: StorageService,
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
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
