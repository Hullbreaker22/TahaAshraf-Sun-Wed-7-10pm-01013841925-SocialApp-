import { myTranslate } from './../../core/services/Translation/myTranslate.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, HostListener, inject, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUser } from '../../core/Models/iuser.interface';
import { NotificationsService } from '../../core/services/Notifications/notifications.service';
import { Icount } from '../../core/Models/Inotific.interface';
import { GlobalService } from '../../core/services/Global/global.service';
import { log } from 'console';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  Mainlist = viewChild<ElementRef>('Mainlist');
  isOpen = false;
  private readonly Database = inject(AuthService)
  private readonly router = inject(Router)
  private readonly GlobalStatus = inject(GlobalService)
  private readonly TranslateService = inject(TranslateService)
  private readonly myTranslate = inject(myTranslate)
  readonly themeService = inject(ThemeService);
  lang = this.myTranslate.lang;
  CurrentUser = signal<IUser>({} as IUser)
  theCount:WritableSignal<Icount> = this.GlobalStatus.NotificaitonCount;
  isLanguageOpen:WritableSignal<boolean> = signal(false)

  constructor(){
    this.TranslateService.setFallbackLang('ar')
  }

  ngOnInit(): void {
    this.getCurrentUser()
    this.getNotificationCount()
  }
  
toggleDown(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    
    const element = this.Mainlist()?.nativeElement;
    if (element) {
      if (this.isOpen) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    }

   
  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
      const element = this.Mainlist()?.nativeElement;
      let target = event.target as HTMLElement;
    
      if (this.isOpen && element && !element.contains(event.target)) {
        element.classList.add('hidden');
        this.isOpen = false;
      }

       if(!target.closest('.languageZone')){
        this.isLanguageOpen.set(false)
       }
      
    }

  Logout(){
    this.Database.Logout();
    this.router.navigate(['/login'])
    console.log('Loggedout sccressfully');
    
  }

  getCurrentUser(){
     let users = JSON.parse(localStorage.getItem('SocialUser')!)
         this.theCount.set(this.GlobalStatus.NotificaitonCount())
         
    if(users){
       this.CurrentUser.set(users)
    }
  }

  toggleLanguage(){
    this.isLanguageOpen.update(val => !val)
  }

  getNotificationCount(){
    this.GlobalStatus.GetNotRead()
    this.theCount = (this.GlobalStatus.NotificaitonCount)
  }


    changeLanguage(lang: 'en' | 'ar') {
      this.myTranslate.setLanguage(lang);
      this.isLanguageOpen.set(false);
    }
}
