import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent implements OnInit {

  listingID: string;
  forumForm = new FormGroup({
    forumField: new FormControl('', Validators.required),
  })
  @ViewChild(PostsComponent, { static: false })
  posts: PostsComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.listingID = paramMap.get('listingID');
    })
  }

  onSubmit() {
    this.router.navigate(['/posts', this.forumForm.get('forumField').value])
    .then(val => {
      this.forumForm.reset();
      if (val) {
        setTimeout(() => {
          const posts = this.posts;
          posts.resetPosts();
        }, 0);
    }});
  }

}
