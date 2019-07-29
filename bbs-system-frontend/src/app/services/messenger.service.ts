import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../models/message';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  $messages = this.socket.fromEvent<Message[]>('messages');
  joinUsername: string;
  loc = {
    position: 0,
    limit: 20
  }

  constructor(
    private socket: Socket,
    private storage: StorageService
  ) {
    this.socket.on('connect', _ => {
      this.listen();
      this.joinConversation();
    });
    this.socket.on('disconnect', _ => console.log('disconnect'));
    this.joinUsername = this.storage.getMsgUsername();
  }

  listen() {
    this.socket.emit('listen', this.storage.retrieveToken());
  }

  joinConversation(username = this.joinUsername) {
    this.socket.emit('joinConversation', username);
    this.storage.setMsgUsername(username);
  }

  getMessages(reset = false) {
    if (reset) {
      this.loc.position = 0;
    }
    console.log(this.loc)
    this.socket.emit('getMessages', this.loc);
    setTimeout(() => {
      this.loc.position += 20;
    }, 0);
  }

  sendMessage(body: string) {
    this.socket.emit('sendMessage', new Message(undefined, this.storage.retrieveUsername(), body));
  }

}
