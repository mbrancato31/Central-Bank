import { TopbarService } from './../topbar/topbar.service';
import { LocalStorageService } from './../local-storage.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // user_info;
  invalid_creds = false;

  constructor(
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private topbarService: TopbarService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.topbarService.set_is_logged(false);
    this.localStorageService.remove("c_bank_user_token");
    this.localStorageService.remove("c_bank_user_id");
    this.localStorageService.remove("c_bank_user_username");
  }

  loginUser(event) {
    event.preventDefault()
    const target = event.target
    const username = target.querySelector('#username').value
    const password = target.querySelector('#password').value

    this.loginService.postLogin({ username: username, password: password })
      .subscribe(data => {
        if (data.status == "success") {
          this.localStorageService.set("c_bank_user_token", data.token);
          this.localStorageService.set("c_bank_user_id", data.id);
          this.localStorageService.set("c_bank_user_username", username);

          this.topbarService.set_is_logged(true);
          this.router.navigate(['/dashboard']);

        } else if (data.status == "failure") {
          this.invalid_creds = true;
        }
      })


    target.reset();
  }


}

export class LoginInfo {
  username: string
  password: string
}
