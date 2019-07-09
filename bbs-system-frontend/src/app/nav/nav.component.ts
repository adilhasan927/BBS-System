import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    private auth: AuthService,
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
    var loginReturn = this.auth.logout(this.storage.retrieveToken()).subscribe(res => {
      window.alert("Logged out.")
    })
    this.storage.deleteToken();
    this.isLoggedIn = false;  
  }
}
