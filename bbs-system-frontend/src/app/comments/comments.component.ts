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
  // position in comments list.
  position: number = 0;
  // number of comments to attempt loading when load button pressed.
  limit: number = 20;
  // has the end of the comments list been reached?
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

  // refreshes comments list.
  resetComments() {
    this.comments = [];
    this.position = 0;
    this.loadComments();
  }

  // fetches limit comments after comment #position.
  loadComments() {
    this.api.getComments(this.postID, this.limit, this.position).subscribe(next => {
      // in case more posts have been posted.
      this.endReached = false;
      this.comments.push(...next.body);
      this.position += this.limit;
      // tells user that no posts remain to be loaded.
      if (next.body.length < this.limit) {
        this.endReached = true;
      }
    }, error => {
      if (error.error = "TokenError") {
        this.router.navigate(['/login']);
      // should not take place.
      } else if (error.error == "DBError") {
        console.log("DBError");
      }
    });
  }

  addComment(username, body) {
    this.comments.unshift(new Comment(username, body));
  }

  // posts comment to API.
  onSubmit() {
    var text = this.commentForm.get('comment').value;
    var loginReturn = this.api.comment(
      this.postID,
      text,
    ).subscribe(res => {
      // if no error takes place.
      console.log(res);
      this.addComment(this.storage.retrieveUsername(), text);
      this.commentForm.reset();
      // if error takes place.
    }, error => {
      if (error.error == "TokenError") {
        this.router.navigate(['/login']);
        // should not take place.
      } else if (error.error == "DBError") {
        console.error("DBError");
      }
    })
  }

  get comment() { return this.commentForm.get('comment'); }

}
