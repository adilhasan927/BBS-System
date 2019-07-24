import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { Profile } from '../models/profile';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: Profile = {
    profileText: "",
    profileImage: "",
  };
  verified: boolean = false;
  routeUsername: string = "";
  tokenUsername: string = "";
  profileForm = new FormGroup({
    profileText: new FormControl('', [
      Validators.required,
    ]),
    profileImage: new FormControl(null, [
      Validators.required,
    ]),
  });
  image: {
    filename: string;
    filetype: string;
    value: string;
  };
  @ViewChild(PostsComponent, { static: false })
  posts: PostsComponent;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.routeUsername = paramMap.get('name');
      this.tokenUsername = this.storage.retrieveUsername();
    })
    if (this.routeUsername == '') {
      this.router.navigate(['/profile', this.tokenUsername])
  } else {
      this.refreshContents();
    }
  }

  refreshContents() {
    this.api.getProfile(this.routeUsername).subscribe(next => {
      this.profile = next.body.profile;
      this.verified = next.body.verified;
      this.profileForm.get('profileText').setValue(next.body.profile.profileText);
    });
    this.posts.resetPosts();
  }

  resendEmail() {
    this.api.resendEmail().subscribe(next => {
      window.alert("Email reset succesfully.")
    }, error => {
      if (error.error == "TokenError") {
        this.router.navigate(['/login']);
      } else if (error.error == "DBError") {
        window.alert("DBError");
      }
    });
  }

  onSubmit() {
    this.api.editProfile(
      this.storage.retrieveToken(),
      this.profileForm.get('profileText').value,
      this.image,
    ).subscribe(next => {
      console.log(next);
      this.refreshContents();
      this.profileForm.reset();
    }, error => {
      if (error.error == "SizeError") {
        window.alert("Image must be 600x600px");
      } else if (error.error == "TypeError") {
        window.alert("Image must be .png file.");
      }
    })
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = {
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        }
      };
    }
  }

  ngOnDestroy() {
  }

  get profileText() { return this.profileForm.get('profileText'); }

  get profileImage() { return this.profileForm.get('profileImage'); }

}
