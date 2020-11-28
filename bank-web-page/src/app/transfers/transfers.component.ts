import { TransfersService } from './transfers.service';
import { LocalStorageService } from './../local-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
  account_types = ['Savings', 'Checking'];
  is_transferred = false;
  invalid_number = false;
  invalid_amount = false;
  receipt = {};

  constructor(
    private localStorageService: LocalStorageService,
    private transferService: TransfersService,
  ) { }

  ngOnInit() {
  }

  transfersUser(event) {
    this.invalid_number = false;
    this.invalid_amount = false;

    event.preventDefault()
    const target = event.target
    let type;
    if (target.querySelector('#acc_type_box').value == "Savings") {
      type = 0;
    } else if (target.querySelector('#acc_type_box').value == "Checking") {
      type = 1;
    }
    const token = this.localStorageService.get("c_bank_user_token");
    const id = this.localStorageService.get("c_bank_user_id");
    const username = this.localStorageService.get("c_bank_user_username");
    const account_number = target.querySelector('#account_number').value;
    const routing_number = target.querySelector('#routing_number').value;
    const amount = target.querySelector('#amount').value;
    let payload = {
      "id": id,
      "username": username,
      "token": token,
      "type": type,
      "account_number": account_number,
      "routing_number": routing_number,
      "amount": amount,
    }

    this.transferService.postLogin(payload)
      .subscribe(data => {
        // console.log(data.status);
        // console.log(data.bill);
        if (data.status == "success") {
          this.is_transferred = true;
          this.receipt = data.bill;
        } else if (data.status == "wrong account or routing number") {
          this.invalid_number = true;
        } else if (data.status == "wrong amount") {
          this.invalid_amount = true;
        }
      })


    target.reset();
  }


}
