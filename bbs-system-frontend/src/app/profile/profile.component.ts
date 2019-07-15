import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: string = "";
  username: string = "";
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
      if (res.successful) {
        console.log(res);
        this.profile = res.body;
      } else {
        this.router.navigate(['/login']);
      }
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
        this.profileForm.reset();
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  ngOnDestroy() {
  }

  get profileText() { return this.profileForm.get('profileText'); }

}
