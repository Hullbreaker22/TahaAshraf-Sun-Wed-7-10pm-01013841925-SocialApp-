import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpclient = inject(HttpClient)


  getAllReaded():Observable<any>{
    return this.httpclient.get(`${environment.baseURL}/notifications?unread=true&page=1&limit=50`)
  }

  getAllNotReaded():Observable<any>{
    return this.httpclient.get(`${environment.baseURL}/notifications?unread=false&page=1&limit=50`)
  }

  getNotificationCounts():Observable<any>{
        return this.httpclient.get(`${environment.baseURL}/notifications/unread-count`)
  }


  MarkAsRead(notificationId:string):Observable<any>{
    return this.httpclient.patch(`${environment.baseURL}/notifications/${notificationId}/read`,{})
  }

  ReadAllNotifications():Observable<any>{
    return this.httpclient.patch(`${environment.baseURL}/notifications/read-all`,{})
  }
}
