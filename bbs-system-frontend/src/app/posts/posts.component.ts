import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../models/post';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  // ID of listing posts are to be retrieved from.
  private _listingID: string;
  posts: Post[] = [];
  // position in posts list.
  position: number = 0;
  // number of posts to attempt loading when load button pressed.
  limit: number = 20;
  // has the end of the posts list been reached?
  endReached: boolean = true;
  postForm = new FormGroup({
    post: new FormControl('', [
      Validators.required,
    ]),
  });
  posts$: Subscription;

  @Input() set listingID(listingID: string) {
    this._listingID = listingID;
    this.resetPosts();
  }
  get listingID(): string { return this._listingID }

  postsReceived: number = 0;
  postsLoaded: number = 0;
  @Output() loaded = new EventEmitter();

  constructor(
    private api: ApiService,
    private storage: StorageService,
  ) { }

  ngOnInit() {
  }

  public resetPosts() {
    this.position = 0;
    this.loadPosts(true);
  }

  loadPosts(reset=false) {
    // fetches limit posts after post #position.
    this.posts$ = this.api.getContent(this.limit, this.position, this.listingID).subscribe(res => {
      // records how many posts were received.
      this.postsReceived = res.body.length;
      if (reset) {
        this.posts = res.body;
      } else {
        this.posts.push(...res.body);
      }
      this.position += this.limit;
      // tells user if posts remain to be received.
      if (this.postsReceived != this.limit) {
        this.endReached = true;
      } else {
        this.endReached = false;
      }
    });
  }

  postLoaded() {
    this.postsLoaded += 1;
    if (this.postsLoaded == this.postsReceived) {
      this.postsLoaded = 0;
      this.postsReceived = 0;
      console.log("posts component loaded");
      this.loaded.emit();
    }
  }

  addPost(_id, username, body) {
    this.posts.unshift(new Post(_id, this.listingID, username, body));
  }

  // posts post to API.
  onSubmit() {
    var text = this.postForm.get('post').value;
    this.api.post(text, this.listingID
    ).subscribe(res => {
      this.addPost(res.body, this.storage.retrieveUsername(), text);
      this.postForm.reset();
    });
  }

  ngOnDestroy() {
    this.posts$.unsubscribe();
  }
  
  get post() { return this.postForm.get('post'); }

}
