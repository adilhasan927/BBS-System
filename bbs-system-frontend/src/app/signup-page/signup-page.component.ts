import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
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
      this.storage.storeToken(res.body);
      this.recaptchaComponent.reset();
      this.signupForm.reset();
      this.router.navigate(['/profile']);
    }, error => {
      if (error.error == "CaptchaError") {
        window.alert("Complete the recaptcha again.");
        this.recaptchaComponent.reset();
      } else if (error.error == "FieldError") {
        window.alert("Invalid form fields.")
      } else if (error.error == "DuplicateError") {
        window.alert("Username already exists.")
      }
      this.recaptchaComponent.reset();
    });
  }

  get email() { return this.signupForm.get('email'); }

  get username() { return this.signupForm.get('username'); }

  get password() { return this.signupForm.get('password'); }
}
