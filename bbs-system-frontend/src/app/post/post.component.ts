import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import { Profile } from '../models/profile';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  // ID of listing post was retrieved from.
  @Input() listingID: string;
  // post to display inputted from parent component.
  @Input() post: Post;
  // acts as model for user profile to display.
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    // retrieve profile of user from API.
    this.api.getProfile(this.post.username).subscribe(next => {
      this.profile = next.body.profile;
    });
  }

}
