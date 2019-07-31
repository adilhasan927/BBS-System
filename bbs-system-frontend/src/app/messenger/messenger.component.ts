import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { MessengerService } from 'src/app/services/messenger.service';
import { Message } from '../models/message';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as Deque from 'double-ended-queue';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  $messages: Observable<Message[]>;
  messages: Deque<Message> = new Deque();
  private _messagesSub: Subscription;

  $error: Observable<string>;
  private _errorSub: Subscription;

  currentUsername: string;

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
  ) {
    this.messages[Symbol.iterator] = function*() {
      const length = this.length;
      var i = 0;
      while (i<length) {
        yield this.get(i++);
      }
    }
    this.route.paramMap.subscribe(paramMap => {
      this.currentUsername = paramMap.get('name');
    })
    if (!this.currentUsername) {
      this.currentUsername = this.storage.getMsgUsername();
    }
  }

  ngOnInit() {
    this.$messages = this.messenger.$messages;
    this._messagesSub = this.$messages.subscribe(messages => {
      if (!this.messages.isEmpty() && messages.length != 0) {
        if (messages[0].timestamp < this.messages.get(0).timestamp) {
          this.messages.push(...messages);
        } else {
          this.messages.unshift(...messages);
        }
      } else {
        this.messages.push(...messages);
      }
    });

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
    this._messagesSub.unsubscribe();
    this._errorSub.unsubscribe();
  }

  navigate() {
    this.messages.clear();
    this.currentUsername = this.username;
    this.messenger.position = 0;
    this.messenger.joinConversation(this.currentUsername);
    this.router.navigate(["/messenger", this.currentUsername]);
  }

  send() {
    this.messenger.sendMessage(this.body);
    this.messageForm.reset();
  }

  load() {
    this.messenger.getMessages();
  }

  get body() { return this.messageForm.get('body').value; }

  get username() { return this.navForm.get('username').value; }

}
