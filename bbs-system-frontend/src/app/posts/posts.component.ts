import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { Post } from '../models/post';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  position: number = 0;
  limit: number = 20;
  endReached: boolean = false;
  postForm = new FormGroup({
    post: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
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
    this.api.getContent(this.limit, this.position).subscribe(res => {
      this.endReached = false;
      if (res.successful) {
        this.posts.push(...res.body);
        this.position += this.limit;
        if (res.body.length < this.limit) {
          this.endReached = true;
        } 
      } else if (res.err.message == "TokenError") {
        this.router.navigate(['/login']);
      } else if (res.err.message == "DBError") {
        window.alert("DBError");
      }
    });
  }

  addPost(_id, username, body) {
    this.posts.unshift(new Post(_id, username, body));
  }

  onSubmit() {
    var text = this.postForm.get('post').value;
    var loginReturn = this.api.post(
      text
    ).subscribe(res => {
      if (res.successful) {
        this.addPost(res.body, this.storage.retrieveUsername(), text);
        this.postForm.reset();
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  get post() { return this.postForm.get('post'); }

}
