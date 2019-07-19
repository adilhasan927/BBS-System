import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {Router, Route, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  success: boolean;
  errorMessage: string;
  token: string;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    this.api.verifyEmail(this.token).subscribe(next => {
      console.log(next)
      this.success = true;
    }, error => {
      if (error.error == "TokenError") {
        this.success = false;
        this.errorMessage = "Token was invalid."
      } else {
        this.success = null;
        this.errorMessage = error.error;
      }
    });
  }

  resendEmail() {
    this.api.resendEmail().subscribe(next => {
      window.alert("Email sent succesffuly.")
    }, error => {
      if (error.error == "TokenError") {
        this.router.navigate(['/login']);
      } else if (error.error == "DBError") {
        window.alert("DBError");
      }
    });
  }

}
