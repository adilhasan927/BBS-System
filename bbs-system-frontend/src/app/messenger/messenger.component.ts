import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { MessengerService } from 'src/app/services/messenger.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  private _errorSub: Subscription;

  private _otherTypingSub: Subscription;
  otherTyping: boolean = false;

  messageForm = new FormGroup({
    body: new FormControl(),
    image: new FormControl()
  }, CustomValidators.atLeastOneValidator);
  private _messageFormSub: Subscription;

  image: File;
  imageUrl: string | ArrayBuffer;

  navForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
    ])
  });

  constructor(
    private messenger: MessengerService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.name) {
        this.messenger.joinUsername = this.storage.getMsgUsername();
      } else {
        this.messenger.joinUsername = params.name;
      }
    })

    this._errorSub = this.messenger.$error.subscribe(error => {
      if (error == "TokenError") {
        console.error("TokenError");
        this.router.navigate(["/login"]);
      } else if (error == "UserNotFoundError") {
        window.alert("No such user in friends list.");
      } else if (error == "DBError") {
        console.error("DBError");
      }
    })

    this._otherTypingSub = this.messenger.$otherTyping.pipe(
      tap(_ => this.otherTyping = true),
      debounceTime(2000),
    ).subscribe(_ => {
      this.otherTyping = false;
    })

    this._messageFormSub = this.messageForm.get('body')
      .valueChanges.subscribe(_ => this.onTyping());
  }

  ngOnDestroy() {
    console.log("destroy");
    this._errorSub.unsubscribe();
    this._otherTypingSub.unsubscribe();
    this._messageFormSub.unsubscribe();
  }

  navigate() {
    this.router.navigate(["/messenger", this.formUsername]);
  }

  sendMessage() {
    if (this.imageUrl) {
      this.api.uploadFile(this.image).then(next => {
        this.messenger.sendMessage(this.body, next);
        this.messageForm.reset();
      });
    } else {
      this.messenger.sendMessage(this.body, null);
    }
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = file;
        this.imageUrl = reader.result;
        console.log(this.imageUrl)
      };
    }
  }


  load() {
    this.messenger.getMessages();
  }

  onTyping() {
    this.messenger.$thisTyping.next();
  }

  get formUsername(): string { return this.navForm.get('username').value; }

  get body(): string { return this.messageForm.get('body').value; }

}
