import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {
  friends: string[] = []
  received: string[] = []

  friends$: Subscription;
  received$: Subscription;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.friends$ = this.api.getFriendsList().subscribe(next => { this.friends = next; })
    this.received$ = this.api.getFriendRequests().subscribe(next => { this.received = next; })
  }

  deleteFriend(username: string) { }

  acceptRequest(username: string) { }

  rejectRequest(username: string) { }

  ngOnDestroy() {
    this.friends$.unsubscribe();
    this.received$.unsubscribe();
  }

}
