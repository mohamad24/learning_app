import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { Storage } from '@ionic/storage';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { AuthenticationProvider } from '../authentication/authentication';
/*
  Generated class for the InterceptProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InterceptProvider  implements HttpInterceptor {

  private token;
  constructor(public http: HttpClient,private storage:Storage,private auth:AuthenticationProvider) {
    console.log('Hello InterceptProvider Provider');
     
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
   this.token= this.auth.getToken();
   console.log('Auth token: '+this.token);
    if(this.token){
      req = req.clone({
        setHeaders: {
          Authorization: `${this.token}`
        }
      });
    }
 

    return next.handle(req);
}

async getToken(){
  this.token = await this.storage.get('auth-token');
}

}
