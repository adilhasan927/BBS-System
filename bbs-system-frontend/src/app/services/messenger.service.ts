import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { Message } from '../models/message';
import { StorageService } from './storage.service';

import * as Deque from 'double-ended-queue';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  $messages = this.socket.fromEvent<Message[]>('messages');
  messages: Deque<Message> = new Deque();

  $error = this.socket.fromEvent<string>('error');

  private _joinUsername: string;
  set joinUsername(username) {
    if (this.joinUsername != username) {
      this._joinUsername = username;
      this.storage.setMsgUsername(username);
      this.messages.clear();
      this.position = 0;
      this.joinConversation();  
    }
  }
  get joinUsername() { return this._joinUsername; } 
  
  private _loc = {
    position: 0,
    limit: 20
  }
  get position() { return this._loc.position };
  set position(pos) {
    this._loc.position = pos;
  }

  constructor(
    private socket: Socket,
    private storage: StorageService
  ) {
    this.messages[Symbol.iterator] = function*() {
      const length = this.length;
      var i = 0;
      while (i<length) {
        yield this.get(i++);
      }
    }

    this.socket.on('connect', _ => this.listen());
    this.socket.on('disconnect', _ => console.log('disconnect'));
    this.joinUsername = this.storage.getMsgUsername();

    this.$messages.subscribe(messages => {
      this.position += messages.length;
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
  }

  listen() {
    this.socket.emit('listen', this.storage.retrieveToken());
  }

  joinConversation() {
    this.socket.emit('joinConversation', this.joinUsername, _ => {
      this.getMessages();
    });
  }

  getMessages() {
    this.socket.emit('getMessages', this._loc);
  }

  sendMessage(body: string) {
    this.socket.emit('sendMessage', new Message(undefined, this.storage.retrieveUsername(), body));
  }

}
