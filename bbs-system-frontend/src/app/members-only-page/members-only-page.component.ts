import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { FetchContentService } from '../fetch-content.service';
import { Post } from '../post';
import { AuthService } from '../auth.service';
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
    private fetchContent: FetchContentService,
    private auth: AuthService,
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.refreshContents();
  }

  refreshContents() {
    this.fetchContent.getContent().subscribe(res => {
      this.posts = res;
    });
  }

  onSubmit() {
    var loginReturn = this.auth.post(
      this.storage.retrieveToken(),
      this.postForm.get('post').value,
    ).subscribe(res => {
      if (res.authSuccessful) {
        this.refreshContents();
        window.alert("Post submitted.");
      } else {
        window.alert("Incorrect token. Logout and login again.")
      }
    })
  }

  get post() { return this.postForm.get('post'); }

}
