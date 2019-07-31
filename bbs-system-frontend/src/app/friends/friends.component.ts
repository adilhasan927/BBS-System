import { Component, OnInit, } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends: any[] = []
  received: any[] = []

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getFriendsList().subscribe(next => { this.friends = next; })
    this.api.getFriendRequests().subscribe(next => { this.received = next; })
  }

  deleteFriend(username: string) {
    this.api.removeFriend(username).subscribe(next => {
      this.friends = this.friends.filter(friend => friend.username != username);
    })
  }

  acceptRequest(username: string) {
    this.api.acceptFriendRequest(username).subscribe(next => {
      this.received = this.received.filter(friend => friend.username != username);
      this.friends.push({ username: username });
    })
  }

  rejectRequest(username: string) {
    this.api.deleteFriendRequest(username).subscribe(next => {
      this.received = this.received.filter(friend => friend.username != username);
    })
  }

}
