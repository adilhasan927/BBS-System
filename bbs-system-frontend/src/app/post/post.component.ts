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
  @Input() post: Post;
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getProfile(this.post.username).subscribe(res => {
      if (res.successful) {
        this.profile = res.body.profile;
      } else if (res.err.message == "DBError") {
        console.log("DBError");
      }
    });
  }

}
