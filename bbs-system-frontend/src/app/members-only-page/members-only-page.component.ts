import { Component, OnInit } from '@angular/core';
import { FetchContentService } from '../fetch-content.service';
import { Post } from '../post';

@Component({
  selector: 'app-members-only-page',
  templateUrl: './members-only-page.component.html',
  styleUrls: ['./members-only-page.component.css']
})
export class MembersOnlyPageComponent implements OnInit {
  posts: Post[];

  constructor(
    private fetchContent: FetchContentService,
  ) { }

  ngOnInit() {
    this.fetchContent.getContent().subscribe(res => {
      this.posts = res;
    });
  }

}
