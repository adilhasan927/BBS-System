import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { Post } from '../models/post';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  // ID of listing posts are to be retrieved from.
  @Input() listingID: string;
  posts: Post[] = [];
  // position in posts list.
  position: number = 0;
  // number of posts to attempt loading when load button pressed.
  limit: number = 20;
  // has the end of the posts list been reached?
  endReached: boolean = false;
  postForm = new FormGroup({
    post: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  resetPosts() {
    this.posts = [];
    this.position = 0;
    this.loadPosts();
  }

  loadPosts() {
    // fetches limit posts after post #position.
    this.api.getContent(this.limit, this.position, this.listingID).subscribe(res => {
      // in case more posts have been posted.
      this.endReached = false;
      this.posts.push(...res.body);
      this.position += this.limit;
      // tells user that no posts remain to be loaded.
      if (res.body.length < this.limit) {
        this.endReached = true;
      }
    });
  }

  addPost(_id, username, body) {
    this.posts.unshift(new Post(_id, this.listingID, username, body));
  }

  // posts post to API.
  onSubmit() {
    var text = this.postForm.get('post').value;
    var loginReturn = this.api.post(
      text,
      this.listingID
    // if not error takes place,
    ).subscribe(res => {
      this.addPost(res.body, this.storage.retrieveUsername(), text);
      this.postForm.reset();
    // if error takes place.
    });
  }

  get post() { return this.postForm.get('post'); }

}
