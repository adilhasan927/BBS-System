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
    this.socket.on('connect', _ => this.listen());
    this.socket.on('disconnect', _ => console.log('disconnect'));
  }

  listen() {
    this.socket.emit('listen', this.storage.retrieveToken());
    if (!this.joinUsername){
      this.joinUsername = this.storage.getMsgUsername();
    }
    this.joinConversation(this.joinUsername, false);
  }

  joinConversation(username: string, refresh: boolean) {
    if (refresh) {
      this.loc.position = 0;
    }
    this.socket.emit('joinConversation', username);
    this.storage.setMsgUsername(username);
    this.getMessages();
  }

  getMessages() {
    this.socket.emit('getMessages', this.loc);
    this.loc.position += 20;
  }

  sendMessage(body: string) {
    this.socket.emit('sendMessage', new Message(undefined, this.storage.retrieveUsername(), body));
  }

}
