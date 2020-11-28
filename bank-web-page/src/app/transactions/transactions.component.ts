import { DashboardComponent } from './../dashboard/dashboard.component';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input() type: string;
  date_up = false;
  amount_up = false;
  transactions = [
    {
      "transaction_id": "",
      "date": "",
      "name": "",
      "amount": 0,
      "status": ""
    }
  ]

  constructor(
    private dashboardComponent: DashboardComponent,
    private localStorageService: LocalStorageService,
    private transactionsService: TransactionsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    // check that there is a token in the storage, if not return to login.
    let token = this.localStorageService.get("c_bank_user_token");
    let id = this.localStorageService.get("c_bank_user_id");
    let username = this.localStorageService.get("c_bank_user_username");
    if (token == null || id == null || username == null) {
      this.router.navigate(['/login']);
    } else {
      // request info of the user and its accounts
      this.transactionsService.postTran(id, username, token, this.type)
        .subscribe(data => {
          if (data.status == "success") {
            this.transactions = data.transactions;
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

  arrange_date(d) {
    this.date_up = !this.date_up;
    this.transactions.sort(function (a, b) {
      let a_date = Number("".concat(a.date.slice(6,10) + a.date.slice(0,2) + a.date.slice(3,5)));
      let b_date = Number("".concat(b.date.slice(6,10) + b.date.slice(0,2) + b.date.slice(3,5)));

      return a_date - b_date;
    })

    if(d == "up"){
      this.transactions.reverse();
    }
  }

  arrange_amount(d) {
    this.amount_up = !this.amount_up;
    this.transactions.sort(function (a, b) {
      return a.amount - b.amount;
    })

    if(d == "up"){
      this.transactions.reverse();
    }
  }

}
