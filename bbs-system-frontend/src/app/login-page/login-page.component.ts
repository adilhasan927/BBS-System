import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  // token returned by Google when recaptcha submitted.
  recaptchaResponse: string;
  // form displayed on page;
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
  // recaptcha implemented as child components.
  @ViewChild(RecaptchaComponent, {static: false} )
  recaptchaComponent: RecaptchaComponent;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  // action taken when user completes captcha.
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaResponse = captchaResponse;
  }

  //action taken when user submits form.
  onSubmit() {
    this.api.login({
      // email field not currently used. 
      // implemented due to credentials class requirements.
      email: null,
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }, this.recaptchaResponse).subscribe(next => {
      // If no errors.
        this.storage.storeToken(next.body);
        this.recaptchaComponent.reset();
        this.loginForm.reset();
        this.router.navigate(['/posts']);
      }, error => {
        // Check for errors returned by server.
        // error.error: string.
        if (error.error == "CaptchaError") {
        window.alert("Complete the reCaptcha again.")
      } else if (error.error == "FieldError") {
        window.alert("Invalid form fields.");
      } else if (error.error == "CredentialsError") {
        window.alert("Incorrect username or password.");
      } else if (error.error == "DuplicateError") {
        window.alert("Username already exists.")
      // Should not take place.
      }
      this.recaptchaComponent.reset();
    })
  }

  // getters and setters to expose values to template.
  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

}