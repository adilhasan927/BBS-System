import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Profile } from '../models/profile';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  // post to display inputted from parent component.
  @Input() username: string;
  //act as friend request?
  @Input() request: boolean;
  // acts as model for user profile to display.
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  @Output() deleteFriend = new EventEmitter();
  @Output() acceptRequest = new EventEmitter();
  @Output() rejectRequest = new EventEmitter();

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    // retrieve profile of user from API.
    this.api.getProfile(this.username).subscribe(next => {
      this.profile = next.body.profile;
    });
  }

}
