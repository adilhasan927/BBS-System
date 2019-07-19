import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import { Profile } from '../models/profile';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  // post to display inputted from parent component.
  @Input() post: Post;
  // acts as model for user profile to display.
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    // retrieve profile of user from API.
    this.api.getProfile(this.post.username).subscribe(next => {
      this.profile = next.body.profile;
      // if server returns an error status code.
    }, error => {
      if (error.error == "TokenError") {
      this.router.navigate(['/login']);
      // should not take place.
      } else if (error.error == "DBError") {
        console.log("DBError");
      }
    });
  }

}
