import { Injectable } from '@angular/core';
import * as _ from 'jwt-decode'
import { Tab } from '../models/tab';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
    const tabs: Array<Tab> = this.getTabs();
    if (!tabs || tabs.length == 0) {
      this.storeTabs([new Tab("main.main", 0)])
    }
  }

  storeToken(token: string): void {
    localStorage.setItem('bbs-token', token);
    localStorage.setItem('username', _(token).username);
  }

  deleteToken(): void {
    localStorage.removeItem('bbs-token');
    localStorage.removeItem('username');
    localStorage.removeItem('tabs');
  }

  retrieveToken(): string { return localStorage.getItem('bbs-token'); }
  
  retrieveUsername(): string { return localStorage.getItem('username'); }

  storeTabs(tabs: Array<Tab>): void { sessionStorage.setItem('tabs', JSON.stringify(tabs)) }

  storeTab(tab: Tab, insert: boolean = true): void {
    var tabs: Array<Tab> = this.getTabs();
    if (!tabs) {
      tabs=[]
    }
    const index = tabs.findIndex(val => val.listingID == tab.listingID);
    if (index != -1) {
      tabs[index] = tab;
    } else {
      if (insert) {
        tabs.push(tab);
      }
    }
    this.storeTabs(tabs);
  }

  getTabs(): Array<Tab> { return JSON.parse(sessionStorage.getItem('tabs')); }

  getTab(listingID: string): Tab {
    const tabs = this.getTabs();
    const tab = tabs.find(val => val.listingID == listingID);
    return tab;
  }

  deleteTab(tab: Tab): void {
    var tabs = this.getTabs();
    tabs = tabs.filter(val => val.listingID != tab.listingID);
    this.storeTabs(tabs);
  }
  
  getMsgUsername() { return localStorage.getItem('msg-username'); }

  setMsgUsername(username: string) { localStorage.setItem('msg-username', username); }

}
