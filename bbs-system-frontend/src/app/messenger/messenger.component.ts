import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { MessengerService } from 'src/app/services/messenger.service';
import { Message } from '../models/message';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as Deque from 'double-ended-queue';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  $messages: Observable<Message[]>;
  messages: Deque<Message> = new Deque();
  private _messagesSub: Subscription;
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

  constructor(private messenger: MessengerService) {
    this.messages[Symbol.iterator] = function*() {
      const length = this.length;
      var i = 0;
      while (i<length) {
        yield this.get(i++);
      }
    }
  }

  ngOnInit() {
    this.messenger.listen();
    this.$messages = this.messenger.$messages;
    this._messagesSub = this.$messages.subscribe(messages => {
      console.log(this.messages, messages)
      if (!this.messages.isEmpty && messages[0]) {
        if (messages[0].timestamp < this.messages.get(0).timestamp) {
          this.messages.push(...messages);
        } else {
          this.messages.unshift(...messages);
        }
      } else {
        this.messages.push(...messages);
      }
    });
  }

  ngOnDestroy() {
    this._messagesSub.unsubscribe();
  }

  navigate() {
    this.messages.clear();
    this.currentUsername = this.username;
    this.messenger.joinConversation(this.currentUsername);
  }

  send() {
    this.messenger.sendMessage(this.body);
  }

  load() {
    this.messenger.getMessages();
  }

  get body() { return this.messageForm.get('body').value; }

  get username() { return this.navForm.get('username').value; }

}
