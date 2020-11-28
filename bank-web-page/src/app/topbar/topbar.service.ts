import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {
  is_logged = false;

  constructor() { }

  set_is_logged(val: boolean) {
    this.is_logged = val;
  }

  get_is_logged() {
    return this.is_logged;
  }
}
