import { inject, Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { NotificationsService } from '../Notifications/notifications.service';
import { Icount } from '../../Models/Inotific.interface';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class GlobalService implements OnInit {

  private readonly NotificationBase = inject(NotificationsService)
  NotificaitonCount:WritableSignal<Icount> = signal({} as Icount)

  ngOnInit(): void {
    this.GetNotRead()
    
  }

  GetNotRead(){
    this.NotificationBase.getNotificationCounts().subscribe({
      next:(res)=>{
      this.NotificaitonCount.set(res.data)
        
      },error:(err)=>{
        console.log(err);

      }
    })
  }


  CheckReadStatus(){
    this.CheckReadStatus()
  }


}
