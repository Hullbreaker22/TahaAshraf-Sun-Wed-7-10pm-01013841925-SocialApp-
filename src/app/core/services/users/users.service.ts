import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UsersService {
  private readonly httpclient = inject(HttpClient)


      getSuggestionsList(limit:number): Observable<any> {

        return this.httpclient.get(`${environment.baseURL}/users/suggestions?limit=${limit}`);
      }


      FolloUser(userId:string):Observable<any>{
        return  this.httpclient.put(`${environment.baseURL}/users/${userId}/follow`,{})
      }
       
      getUserProfile(userId:string):Observable<any>{
        return this.httpclient.get(`${environment.baseURL}/users/${userId}/profile`)
      }

      UploadProfilePic(data:any){
        return this.httpclient.put(`${environment.baseURL}/users/upload-photo`,data)
      }

      changePass(body:any):Observable<any>{
        return this.httpclient.patch(`${environment.baseURL}/users/change-password`,body)
      }

}
