import { TransactionsComponent } from './../transactions/transactions.component';
import { DashboardService } from './dashboard.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user_info = {
    "user_id": 0,
    "first_name": "",
    "last_name": "",
    "ssn": 0,
    "address": "",
    "phone_number": ""
  }
  accounts_info = [{
    "user_id": 0,
    "account_number": 0,
    "routing_number": 0,
    "type": 0,
    "balance": 0
  },
  {
    "user_id": 0,
    "account_number": 0,
    "routing_number": 0,
    "type": 1,
    "balance": 0
  }]

  constructor(
    private localStorageService: LocalStorageService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    //check that there is a token in the storage, if not return to login.
    let token = this.localStorageService.get("c_bank_user_token");
    let id = this.localStorageService.get("c_bank_user_id");
    let username = this.localStorageService.get("c_bank_user_username");
    if (token == null || id == null || username == null) {
      this.router.navigate(['/login']);
    } else {
      // request info of the user and its accounts
      this.dashboardService.postDash(id, username, token)
        .subscribe(data => {
          if (data.status == "success") {
            this.user_info = data.user_info;
            this.accounts_info = data.accounts_info;
          }
          else if (data.status == "wrong_token" || data.status == "wrong_username" || data.status == "wrong_id") {
            this.localStorageService.remove("c_bank_user_token");
            this.localStorageService.remove("c_bank_user_id");
            this.localStorageService.remove("c_bank_user_username");
            this.router.navigate(['/login']);
          }
        });


    }
  }

  get_type_account(type) {
    if (type == 0) {
      return true;
    }
    return false;
  }

  set_type(type) {
    console.log(type)
  }

}
