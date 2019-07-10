import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';

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
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  
  onSubmit() {
    var loginReturn = this.auth.login(
      this.loginForm.value,
    ).subscribe(res => {
      if (res.authSuccessful) {
        this.storage.storeToken(res.token);
        this.storage.storeUsername(this.loginForm.get('username').value);
        this.router.navigate(['/members-only']);
      } else {
        window.alert("Incorrect credentials.")
      }
    })
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

}