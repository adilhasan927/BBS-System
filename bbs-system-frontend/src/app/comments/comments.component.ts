import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { Comment } from '../models/comment';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  postID: string;
  position: number = 0;
  limit: number = 20;
  endReached: boolean = false;
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
    this.loadComments();
  }

  resetComments() {
    this.comments = [];
    this.position = 0;
    this.loadComments();
  }

  loadComments() {
    this.api.getComments(this.postID, this.limit, this.position).subscribe(res => {
      this.endReached = false;
      console.log(res);
      if (res.successful) {
        this.comments.push(...res.body);
        this.position += this.limit;
        if (res.body.length < this.limit) {
          this.endReached = true;
        } 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  addComment(username, body) {
    this.comments.unshift(new Comment(username, body));
  }

  onSubmit() {
    var text = this.commentForm.get('comment').value;
    var loginReturn = this.api.comment(
      this.postID,
      text,
    ).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.addComment(this.storage.retrieveUsername(), text);
        this.commentForm.reset();
      } else if (res.err.message == "TokenError") {
        this.router.navigate(['/login']);
      } else if (res.err.message == "DBError") {
        window.alert("DBError");
      }
    })
  }

  get comment() { return this.commentForm.get('comment'); }

}
