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
  @Input() comment: Comment;
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.api.getProfile(this.comment.username).subscribe(next => {
      this.profile = next.body.profile;
    }, error => {
      if (error.error == "TokenError") {
        this.router.navigate(['/login']);
      } else if (error.error == "DBError") {
        console.log("DBError");
      }
    });
  }

}
