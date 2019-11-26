import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';  
import { Platform, Events } from 'ionic-angular';
import { ApiProvider } from '../api/api';
import { BehaviorSubject } from 'rxjs';
 
const TOKEN_KEY = 'auth-token';
const STUDENT = 'student-data';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {
  authenticationState = new BehaviorSubject(false);
  public loginAction = false;
  private authToken;
  constructor(public http: HttpClient,private storage: Storage, private plt: Platform, private apiService:ApiProvider,public events:Events) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authToken = res;
        this.authenticationState.next(true);
      }
    })
  }
 
  login(student) {
    
    this.storage.set(STUDENT,student);
    this.authToken = student.token;
    return this.storage.set(TOKEN_KEY, student.token).then(() => {
      this.authenticationState.next(true);
      this.events.publish("auth:logged-in");
    });


  }
 
  logout() {
    this.loginAction= false;
    this.authToken= null;
    this.storage.remove(STUDENT);
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }

  public setLoginAction(status){
    this.loginAction = status;
  }

  public getToken(){
    return this.authToken;
  }

  public getStoredToken(){
    return this.storage.get(TOKEN_KEY);
  }

}
