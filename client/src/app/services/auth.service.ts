import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev:boolean;

  constructor(private http:Http) {
     this.isDev = true;
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let url = this.prepEndpoint('user/register');
    return this.http.post(url, user,{headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let url = this.prepEndpoint('user/authenticate');
    return this.http.post(url, user,{headers: headers})
      .map(res => res.json());
  }


  authenticateFbUser(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let url = this.prepEndpoint('auth/facebook/callback');
    return this.http.get(url,{headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loggedIn(){
    return tokenNotExpired(null,this.authToken);
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    let url = this.prepEndpoint('user/profile');
    return this.http.get(url,{headers: headers})
      .map(res => res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  prepEndpoint(ep){
    if(!this.isDev){
      return ep;
    } else {
      return 'http://localhost:3000/'+ep;
    }
  }
}
