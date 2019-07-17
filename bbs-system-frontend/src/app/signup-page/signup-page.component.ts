import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';
import { CustomValidators } from '../custom-validators';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
  recaptchaResponse: string;
  signupForm = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email,
    ]),
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    password: new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    }, CustomValidators.confirmPasswordValidator),
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
    // TODO: Add validation, routing.
    var signupReturn = this.api.signup({
      email: this.signupForm.get('email').value,
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password.password').value,
    }, this.recaptchaResponse,
    ).subscribe(res => {
      if (res.successful) {
        this.storage.storeToken(res.body);
        this.signupForm.reset();
        this.recaptchaComponent.reset();
        this.router.navigate(['/posts']);
      } else if (res.err.message == "CaptchaError") {
        this.recaptchaComponent.reset;
        window.alert("Complete the recaptcha again.");
      } else if (res.err.message == "FieldError") {
        window.alert("Invalid form fields.")
      } else if (res.err.message == "DBError") {
        window.alert("Database error.")
      } else {
        window.alert("An unknown error occurred.")
      }
    })
  }

  get email() { return this.signupForm.get('email'); }

  get username() { return this.signupForm.get('username'); }

  get password() { return this.signupForm.get('password'); }
}
