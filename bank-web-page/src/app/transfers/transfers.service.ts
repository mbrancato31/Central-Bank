import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransfersService {

    baseURL: string = "http://localhost:4000/";

    constructor(private http: HttpClient) {
    }

    postLogin(payload): Observable<any> {

        // console.log(payload)

        let body = new URLSearchParams();
        body.set('user_id', payload.id);
        body.set('username', payload.username);
        body.set('token', payload.token);
        body.set('type', payload.type);
        body.set('account_number', payload.account_number);
        body.set('routing_number', payload.routing_number);
        body.set('amount', payload.amount);
        let transferUrl = this.baseURL + "transferinfo";
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        return this.http.post(transferUrl, body.toString(), options)



    }


}
