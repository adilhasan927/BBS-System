import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { MessengerService } from 'src/app/services/messenger.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  $messages: Observable<Message[]>;
  messages: Message[];
  private _messagesSub: Subscription;

  constructor(private messenger: MessengerService) { }

  ngOnInit() {
    this.messenger.listen();
    this.$messages = this.messenger.$messages;
    this._messagesSub = this.$messages.subscribe(messages => this.messages = messages);
 }

  ngOnDestroy() {
    this._messagesSub.unsubscribe();
  }

  sendMessage(to: string, body: string) {
    this.messenger.sendMessage(to, body);
  }

}
