import { Component, computed, ElementRef, inject, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { NotificationsService } from '../../../core/services/Notifications/notifications.service';
import { INotific } from '../../../core/Models/Inotific.interface';
import { RouterLink } from '@angular/router';
import { Writable } from 'stream';
import { GlobalService } from '../../../core/services/Global/global.service';
import { SplitPipe } from '../../../core/Pipes/split-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink , SplitPipe, TranslatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit{
  private readonly NotificaonBase = inject(NotificationsService)
  private readonly GlobalStatus = inject(GlobalService)
  ReadList:WritableSignal<INotific[]> = signal([])
  NotReadList:WritableSignal<INotific[]> = signal([])
  BothReadandNot = computed(() => {
    if (this.isAll()) {
      return [...this.NotReadList(), ...this.ReadList()];
    } else {
      return [...this.NotReadList()];
    }
  });
  ReadMark = viewChild<ElementRef<HTMLElement>>('ReadMark')
  isAll:WritableSignal<boolean> = signal(true)
  ngOnInit(): void {
    this.getAllReadedNotification();
    this.getAllNotReadedNotification();
  }

    formatPostDate(dateString: string): string {
      if (!dateString) return '';

      const postDate = new Date(dateString).getTime();
      const now = new Date().getTime();
      const diffInSeconds = Math.floor((now - postDate) / 1000);

      if (diffInSeconds < 60) {
        return 'Just now';
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes}m `;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours}h `;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays}d `;
      }

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return `${diffInMonths}mo `;
      }

      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears}y `;
    }



  getAllReadedNotification(){
    this.NotificaonBase.getAllReaded().subscribe({
      next:(res)=>{
        this.ReadList.set(res.data.notifications)
        
      },error:(err)=>{
        console.log(err);
       
      }
    })
  }
  getAllNotReadedNotification(){
    this.NotificaonBase.getAllNotReaded().subscribe({
      next:(res)=>{
        this.NotReadList.set(res.data.notifications)
        console.log(res);
        
      },error:(err)=>{
        console.log(err);
       
      }
    })
  }


  stopProbagation(e:Event){
    e.stopPropagation()
  }

  MarkNotificationAsRead(notificationId:string){
  
    this.NotificaonBase.MarkAsRead(notificationId).subscribe({
      next:(res)=>{
        console.log(res);
         this.getAllReadedNotification();
         this.getAllNotReadedNotification();
        this.GlobalStatus.GetNotRead();
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }

  SwitchTonotRead(){
    this.isAll.set(false)
  }

  SwitchToRead(){
    this.isAll.set(true)
  }



  getNotificationsCount(){
    this.NotificaonBase.getNotificationCounts().subscribe({
      next:(res)=>{
        console.log(res);

      },error:(err)=>{
        console.log(err);
       
      }
    })
  }

  CheckType(Types:string ):string{
    let finalResult = ''
    if(Types){
      if(Types == 'comment_post'){
        finalResult = 'commented on your post'
      }else if (Types == 'like_post'){
         finalResult = 'liked your post'
      }else if(Types == 'follow_user'){
        finalResult = 'followed you'
      }else if(Types ==  'share_post'){
        finalResult = 'Sharred Your Post!'
      } 
    }
    return finalResult
  }
 


  markAllAsRead(){
    this.NotificaonBase.ReadAllNotifications().subscribe({
      next:(res)=>{
        console.log(res);
        this.getAllReadedNotification();
        this.getAllNotReadedNotification();
        this.GlobalStatus.CheckReadStatus();
        this.GlobalStatus.GetNotRead();
      },error:(err)=>{
        console.log(err);     
      }
    })
  }
}
