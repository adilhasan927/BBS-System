import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentsComponent } from './comments/comments.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CreateForumComponent } from './create-forum/create-forum.component';
import { MessengerComponent } from './messenger/messenger.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'posts/:listingID', component: PostsPageComponent, canActivate: [AuthGuard] },
  { path: 'profile', redirectTo: 'profile/', canActivate: [AuthGuard] },
  { path: 'profile/:name', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'comments/:listingID/:id', component: CommentsComponent, canActivate: [AuthGuard] },
  { path: 'verify-email/:token', component: VerifyEmailComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'create-forum', component: CreateForumComponent },
  { path: 'messenger', component: MessengerComponent },
  { path: '', redirectTo: 'posts/main.main', pathMatch: 'full'},
  { path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
