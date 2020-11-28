import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { LoginInfo } from './login.component';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

    baseURL: string = "http://localhost:4000/";

    constructor(private http: HttpClient) {
    }

    postTran(id, username, token, type): Observable<any> {

        let body = new URLSearchParams();
        body.set('user_id', id);
        body.set('username', username);
        body.set('token', token);
        body.set('type', type);
        let dashUrl = this.baseURL + "transactionsinfo";
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        return this.http.post(dashUrl, body.toString(), options)



    }


}
