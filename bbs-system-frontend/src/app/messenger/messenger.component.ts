import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { MessengerService } from 'src/app/services/messenger.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  $error: Observable<string>;
  private _errorSub: Subscription;

  messageForm = new FormGroup({
    body: new FormControl('', [
      Validators.required,
    ])
  });
  navForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
    ])
  });

  constructor(
    private messenger: MessengerService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.name) {
        this.messenger.joinUsername = this.storage.getMsgUsername();
      } else {
        this.messenger.joinUsername = params.name;
      }
    })

    this.$error = this.messenger.$error;
    this._errorSub = this.$error.subscribe(error => {
      if (error == "TokenError") {
        console.error("TokenError");
        this.router.navigate(["/login"]);
      } else if (error == "UserNotFoundError") {
        window.alert("No such user in friends list.");
      } else if (error == "DBError") {
        console.error("DBError");
      }
    })
  }

  ngOnDestroy() {
    console.log("destroy");
    this._errorSub.unsubscribe();
  }

  navigate() {
    this.router.navigate(["/messenger", this.formUsername]);
  }

  send() {
    this.messenger.sendMessage(this.body);
    this.messageForm.reset();
  }

  load() {
    this.messenger.getMessages();
  }

  get body() { return this.messageForm.get('body').value; }

  get formUsername() { return this.navForm.get('username').value; }

}
