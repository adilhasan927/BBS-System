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
  comments: Comment[] = [];
  postID: string;
  position: number = 0;
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

  loadComments() {
    this.api.getComments(this.postID, this.position).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.comments.push(...res.body);
        this.position += 20;
        if (res.body.length < 20) {
          this.endReached = true;
        } 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  refreshContents() {
    this.position = 0;
    this.loadComments();
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
