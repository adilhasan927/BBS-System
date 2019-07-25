import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../models/message';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  $messages = this.socket.fromEvent<Message[]>('messages');

  constructor(
    private socket: Socket,
    private storage: StorageService
  ) { }

  listen() {
    this.socket.emit('listen', this.storage.retrieveToken());
  }

  joinConversation(username: string) {
    this.socket.emit('joinConversation', username);
  }

  getMessages() {
    this.socket.emit('getMessages');
  }

  sendMessage(body: string) {
    this.socket.emit('sendMessage', new Message(undefined, this.storage.retrieveUsername(), body));
  }

}
