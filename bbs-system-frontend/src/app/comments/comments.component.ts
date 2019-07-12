import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { Comment } from '../comment';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[];
  postID: string;
  commentForm = new FormGroup({
    comment: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.postID = paramMap.get('id');
    })
    this.refreshContents();
  }

  refreshContents() {
    this.api.getComments(this.postID).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.comments = res.body;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    var loginReturn = this.api.comment(
      this.storage.retrieveToken(),
      this.postID,
      this.commentForm.get('comment').value,
    ).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.refreshContents();
        this.commentForm.reset();
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  get comment() { return this.commentForm.get('comment'); }

}
