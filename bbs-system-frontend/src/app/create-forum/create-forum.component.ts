import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-forum',
  templateUrl: './create-forum.component.html',
  styleUrls: ['./create-forum.component.css']
})
export class CreateForumComponent implements OnInit {

  recaptchaResponse: string;
  createForumForm = new FormGroup({
    settings: new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    }),
    recaptchaReactive: new FormControl(null, Validators.required)
  })

  @ViewChild(RecaptchaComponent, {static: false} )
  recaptchaComponent: RecaptchaComponent;

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaResponse = captchaResponse;
  }

  onSubmit() {
    const listingID = 'main.' + this.createForumForm.get('settings.name').value
    this.api.createForum(
      listingID,
      this.createForumForm.get('settings.description').value,
      this.recaptchaResponse
    ).subscribe(res => {
      this.recaptchaComponent.reset();
      this.router.navigate(['/posts', listingID])
      this.createForumForm.reset();
    }, error => {
      if (error.error == "CaptchaError") {
        window.alert("Complete the recaptcha again.");
      } else if (error.error == "FieldError") {
        window.alert("Invalid form fields.")
      } else if (error.error == "DuplicateError") {
        window.alert("Username already exists.")
      }
      this.recaptchaComponent.reset();
    })
  }

  get settings() { return this.createForumForm.get("settings"); }

  get name() { return this.createForumForm.get("settings.name"); }

  get description() { return this.createForumForm.get("settings.description"); }

}
