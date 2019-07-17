import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../models/comment';
import { Profile } from '../models/profile';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getProfile(this.comment.username).subscribe(res => {
      if (res.successful) {
        this.profile = res.body.profile;
        console.log(this.profile)
      } else if (res.err.message == "DBError") {
        console.log("DBError");
      }
    });
  }

}
