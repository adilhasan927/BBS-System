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

  sendMessage(to: string, body: string) {
    this.socket.emit('sendMessage', new Message(to, this.storage.retrieveUsername(), body));
  }

}
