import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
  signupForm = new FormGroup({
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
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  
  onSubmit() {
    // TODO: Add validation, routing.
    var signupReturn = this.api.signup(
      this.signupForm.value
    ).subscribe(res => {
      if (res.successful) {
        this.signupForm.reset();
        this.storage.storeToken(res.body);
        this.storage.storeUsername(this.signupForm.get('username').value);
        this.router.navigate(['/posts']);
      } else {
        window.alert("Incorrect values.")
      }
    })
  }

  get username() { return this.signupForm.get('username'); }

  get password() { return this.signupForm.get('password'); }

}
