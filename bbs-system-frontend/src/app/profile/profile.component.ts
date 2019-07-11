import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router"
import { Post } from '../post';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: string = "";
  username: string = "";
  localusername: string = this.storage.retrieveUsername();
  profileForm = new FormGroup({
    profileText: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.username = paramMap.get('name')
    })
    this.refreshContents();
  }

  refreshContents() {
    this.api.getProfile(this.username).subscribe(res => {
      console.log(res);
      this.profile = res.body;
    });
  }

  onSubmit() {
    this.api.editProfile(
      this.storage.retrieveToken(),
      this.profileForm.get('profileText').value,
    ).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.refreshContents();
      } else{
        window.alert("Form submission failed.");
      }
    })
  }

  ngOnDestroy() {
  }

  get profileText() { return this.profileForm.get('profileText'); }

}
