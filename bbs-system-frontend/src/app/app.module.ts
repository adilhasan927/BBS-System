import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RecaptchaModule} from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { PostsComponent } from './posts/posts.component';
import { NavComponent } from './nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommentsComponent } from './comments/comments.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { httpInterceptorProviders } from './http-interceptors/';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { CreateForumComponent } from './create-forum/create-forum.component';
import { MessengerComponent } from './messenger/messenger.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    PostsComponent,
    NavComponent,
    ProfileComponent,
    NotFoundComponent,
    CommentsComponent,
    PostComponent,
    CommentComponent,
    VerifyEmailComponent,
    PostsPageComponent,
    CreateForumComponent,
    MessengerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
