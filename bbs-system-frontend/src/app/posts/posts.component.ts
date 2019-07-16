import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { Post } from '../post';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  position: number = 0;
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

  loadPosts() {
    this.api.getContent(this.position).subscribe(res => {
      if (res.successful) {
        this.posts.push(...res.body);
        this.position += 20;
        if (res.body.length < 20) {
          this.endReached = true;
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  addPost(username, body) {
    this.posts.push(new Post(username, body));
  }

  onSubmit() {
    var text = this.postForm.get('post').value;
    var loginReturn = this.api.post(
      this.storage.retrieveToken(),
      text,
    ).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.addPost(this.storage.retrieveUsername(), text);
        this.postForm.reset();
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  get post() { return this.postForm.get('post'); }

}
