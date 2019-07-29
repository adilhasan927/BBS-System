import { Component, OnInit, OnDestroy } from '@angular/core';
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
    private storage: StorageService
  ) {
    this.messages[Symbol.iterator] = function*() {
      const length = this.length;
      var i = 0;
      while (i<length) {
        yield this.get(i++);
      }
    }
    this.currentUsername = storage.getMsgUsername();
  }

  ngOnInit() {
    this.$messages = this.messenger.$messages;
    this._messagesSub = this.$messages.subscribe(messages => {
      console.log(this.messages, messages)
      if (!this.messages.isEmpty() && messages.length != 0) {
        if (messages[0].timestamp < this.messages.get(0).timestamp) {
          this.messages.push(...messages);
          console.log('push1');
        } else {
          this.messages.unshift(...messages);
          console.log('unshift');
        }
      } else {
        this.messages.push(...messages);
        console.log('push2');
      }
    });
  }

  ngOnDestroy() {
    this._messagesSub.unsubscribe();
  }

  navigate() {
    this.messages.clear();
    this.currentUsername = this.username;
    this.messenger.joinConversation(this.currentUsername, true);
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
