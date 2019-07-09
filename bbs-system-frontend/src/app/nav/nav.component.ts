import { Component, OnInit } from '@angular/core';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(
    private token: TokenService,
    private router: Router,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
       this.isLoggedIn = this.token.retrieveToken() != null;
      }
    })
  }

  logout() {
    var loginReturn = this.auth.logout().subscribe(res => {
      window.alert("Logged out.")
      this.token.deleteToken();
      this.isLoggedIn = false;  
    })
  }
}
