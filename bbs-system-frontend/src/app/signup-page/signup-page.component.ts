import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router"
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
  signupForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
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
    var signupReturn = this.auth.signup(
      this.signupForm.value
    ).subscribe(res => {
      if (res.authSuccessful) {
        this.token.storeToken(res.token);
        this.router.navigate(['/members-only']);
      } else {
        window.alert("Incorrect values.")
      }
    })
  }

}
