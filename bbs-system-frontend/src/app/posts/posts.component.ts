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
  posts: Post[];
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
    this.refreshContents();
  }

  refreshContents() {
    this.api.getContent().subscribe(res => {
      this.posts = res.body;
    });
  }

  onSubmit() {
    var loginReturn = this.api.post(
      this.storage.retrieveToken(),
      this.postForm.get('post').value,
    ).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.refreshContents();
        this.postForm.reset();
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  get post() { return this.postForm.get('post'); }

}
