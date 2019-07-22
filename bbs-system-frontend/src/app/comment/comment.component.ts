import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../models/comment';
import { Profile } from '../models/profile';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  // ID of listing comment was retrieved from.
  @Input() listingID: string;

  @Input() comment: Comment;
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.api.getProfile(this.comment.username).subscribe(next => {
      this.profile = next.body.profile;
    });
  }

}
