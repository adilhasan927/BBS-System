import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { Message } from '../models/message';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';

import * as Deque from 'double-ended-queue';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  $messages = this.socket.fromEvent<Message[]>('messages');
  messages: Deque<Message> = new Deque();

  $error = this.socket.fromEvent<string>('error');
  $otherTyping = this.socket.fromEvent<any>('typing');
  $thisTyping = new Subject()

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
    private storage: StorageService,
    private api: ApiService
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

      messages.map(val => {
        console.log(val);
        if (val.filename) {
          this.api.downloadFile(val.filename).subscribe(next => {
            const reader = new FileReader();
            reader.readAsDataURL(next);
            reader.onload = () => {
              val.image = reader.result.toString();
            }
          })
        }
      })

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

    this.$thisTyping.pipe(
      throttleTime(1000)
    ).subscribe(_ => {
      this.socket.emit('typing');
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

  sendMessage(body: string, filename: string) {
    this.socket.emit(
      'sendMessage',
      new Message(undefined, this.storage.retrieveUsername(), body, filename)
    );
  }

}
