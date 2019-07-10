import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { Post } from '../post';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-members-only-page',
  templateUrl: './members-only-page.component.html',
  styleUrls: ['./members-only-page.component.css']
})
export class MembersOnlyPageComponent implements OnInit {
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
        window.alert("Post submitted.");
      } else {
        window.alert("Incorrect token.");
        this.router.navigate(['/login']);
      }
    })
  }

  get post() { return this.postForm.get('post'); }

}
