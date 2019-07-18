import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { Profile } from '../models/profile';

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
    this.api.getProfile(this.routeUsername).subscribe(res => {
      if (res.successful) {
        this.profile = res.body.profile;
        this.verified = res.body.verified;
        this.profileForm.get('profileText').setValue(res.body.profile.profileText);
      } else if (res.err.message == "TokenError") {
        this.router.navigate(['/login']);
      } else if (res.err.message == "DBError") {
        window.alert("DBError");
      }
    });
  }

  resendEmail() {
    this.api.resendEmail().subscribe(res => {
      if (res.successful) {
        this.refreshContents();
        this.profileForm.reset();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    this.api.editProfile(
      this.storage.retrieveToken(),
      this.profileForm.get('profileText').value,
      this.image,
    ).subscribe(res => {
      console.log(res);
      if (res.successful) {
        this.refreshContents();
        this.profileForm.reset();
      } else if (res.err.message == "TokenError") {
        this.router.navigate(['/login']);
      } else if (res.err.message == "SizeError") {
        window.alert("Image must be 600x600px");
      } else if (res.err.message == "TypeError") {
        window.alert("Image must be .png file.");
      } else if (res.err.message == "DBError") {
        window.alert("DBError");
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
