import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostsComponent } from '../posts/posts.component';
import { StorageService } from '../services/storage.service';
import { Tab } from '../models/tab';

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
    private storage: StorageService,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.listingID = paramMap.get('listingID');
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.listingID) {
          this.storage.storeTab(new Tab(
            this.listingID,
            document.documentElement.scrollTop
          ), false)
        }
      }
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.posts) {
          setTimeout(() => {
            this.posts.resetPosts();
          }, 0);
          const tab = this.storage.getTab(this.listingID);
          window.scrollTo(0, tab.scrollY);
        }
      }
    })
  }

  onSubmit() {
    const listingID = this.forumForm.get('forumField').value;
    this.storage.storeTab(new Tab(listingID, 0));
    this.router.navigate(['/posts', listingID])
    .then(val => {
      this.forumForm.reset();
    });
  }

}
