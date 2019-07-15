import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
  recaptchaResponse: string;
  signupForm = new FormGroup({
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
    }, [CustomValidators.confirmPasswordValidator]),
    recaptchaReactive: new FormControl(null, Validators.required),
  });

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
    var signupReturn = this.api.signup(
      this.signupForm.value,
      this.recaptchaResponse,
    ).subscribe(res => {
      if (res.successful) {
        this.storage.storeToken(res.body);
        this.signupForm.controls
        this.router.navigate(['/posts']);
        this.signupForm.reset();
      } else {
        window.alert("Incorrect values.")
      }
    })
  }

  get username() { return this.signupForm.get('username'); }

  get password() { return this.signupForm.get('password'); }
}
