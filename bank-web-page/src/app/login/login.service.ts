import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginInfo } from './login.component';

@Injectable({ providedIn: 'root' })
export class LoginService {

    baseURL: string = "http://localhost:4000/";

    constructor(private http: HttpClient) {
    }

    postLogin(creds: LoginInfo): Observable<any> {

        let body = new URLSearchParams();
        body.set('username', creds.username);
        body.set('password', creds.password);
        let credsUrl = this.baseURL + "credentials";
        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        return this.http.post(credsUrl, body.toString(), options)



    }


}
