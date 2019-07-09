import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  
  onSubmit() {
    // TODO: Add validation, routing.
    var loginReturn = this.auth.login(
      this.loginForm.value,
    ).subscribe(res => {
      if (res.authSuccessful) {
        this.token.storeToken(res.token);
        this.router.navigate(['/members-only']);
      } else {
        window.alert("Incorrect credentials.")
      }
    })
  }

}