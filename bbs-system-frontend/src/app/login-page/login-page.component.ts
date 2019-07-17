import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  recaptchaResponse: string;
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    recaptchaReactive: new FormControl(null, Validators.required),
  });

  @ViewChild(RecaptchaComponent, {static: false} )
  recaptchaComponent: RecaptchaComponent;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaResponse = captchaResponse;
  }

  onSubmit() {
    this.api.login({
      email: null,
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }).subscribe(res => {
      if (res.successful) {
        this.storage.storeToken(res.body);
        this.router.navigate(['/posts']);
        this.recaptchaComponent.reset();
        this.loginForm.reset();
      } else if (res.err.message == "CaptchaError") {
        this.recaptchaComponent.reset();
        window.alert("Complete the reCaptcha again.")
      } else if (res.err.message == "FieldError") {
        window.alert("Invalid form fields.");
      } else if (res.err.message == "CredentialsError") {
        window.alert("Incorrect username or password.");
      } else if (res.err.message == "DBError") {
        window.alert("Database error.");
      }
    })
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

}