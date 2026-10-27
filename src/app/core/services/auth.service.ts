import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpclient = inject(HttpClient)

  register(data:Object):Observable<any>{
     return this.httpclient.post(`${environment.baseURL}/users/signup`,data)
  }

  Login(data:Object):Observable<any>{
      return this.httpclient.post(`${environment.baseURL}/users/signin`,data)
  }

  Logout(){
    localStorage.removeItem('SocialKey')
    localStorage.removeItem('SocialUser')
  }
}
