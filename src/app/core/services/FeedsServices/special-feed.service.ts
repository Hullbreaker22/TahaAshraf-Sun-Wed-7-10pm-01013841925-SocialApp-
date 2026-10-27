import { IUser } from './../../Models/iuser.interface';
import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { IPost } from '../../Models/Ipost.interface';
import { PostsService } from '../posts.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpecialFeedService {
  Postslist: WritableSignal<IPost[]> = signal([]);
  currentpage: WritableSignal<number> = signal(1);
  totalPages: WritableSignal<number> = signal(1);
  isOn: WritableSignal<string> = signal('feed');
  loading: WritableSignal<boolean> = signal(false)
  private readonly htppService = inject(PostsService);
  CookieUser:WritableSignal<IUser | null> = signal(this.getUser)
  toster = inject(ToastrService)
  Spinner = inject(NgxSpinnerService)


 get getUser(): IUser | null {
    const savedUser = localStorage.getItem('SocialUser');
    return savedUser ? (JSON.parse(savedUser) as IUser) : null;
  }


  checkOnstatus(){
    if(this.isOn() == 'feed'){
       this.getFeedPosts();
    }else if(this.isOn() == 'community'){
      this.getAllposts(this.currentpage());
    }else if(this.isOn()=='MyPosts'){
      this.getMyPosts()
    }else if(this.isOn()=='Marked'){
      this.getMarkeedPosts()
    }
  }
  
  getAllposts(page: number = 1){
    this.loading.set(true)
    this.Spinner.show()
    this.htppService.getAllposts(page).pipe(finalize(()=>{
      this.Spinner.hide();
      this.loading.set(false);
    })).subscribe({
      next: (res) => { 
        this.Postslist.set(res.data.posts);
        this.currentpage.set(res.meta.pagination.currentPage);
        this.totalPages.set(res.meta.pagination.numberOfPages);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  getMyPosts():void{
    
    const currentUserId = this.CookieUser()?._id;

      if (!currentUserId) {
        console.log('User ID is missing');
        return;
      }
     this.loading.set(true)
    this.htppService.getMyPosts(currentUserId).pipe(finalize(()=>{
        this.loading.set(false)
    })).subscribe({
      next: (res) => {
        this.Postslist.set(res.data.posts);
        this.currentpage.set(res.meta.pagination.currentPage);
        this.totalPages.set(res.meta.pagination.numberOfPages);

        
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  getFeedPosts(){
    this.loading.set(true)
    this.htppService.getFeedPosts().pipe(finalize(()=>{
        this.loading.set(false)
    })).subscribe({
      next: (res) => {
        this.Postslist.set(res.data.posts);
        this.currentpage.set(res.meta.pagination.currentPage);
        this.totalPages.set(res.meta.pagination.numberOfPages);
        
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  getMarkeedPosts(){
      this.loading.set(true)
      this.htppService.getMarkedPosts().pipe(finalize(()=>{
      this.loading.set(false)
    })).subscribe({
      next: (res) => {  
        this.Postslist.set(res.data.bookmarks);
        this.currentpage.set(res.meta.pagination.currentPage);
        this.totalPages.set(res.meta.pagination.numberOfPages);

      },
      error: (err) => {
        console.log(err);
        this.toster.error(err.error.message , 'Error!!')
      }
    });
  }

  FeedOn(){
    this.isOn.set('feed');
  }
  
  CommunityOn(){
    this.isOn.set('community');
  }

  myPostsOn(){
    this.isOn.set('MyPosts');
  }

  MarkedOn(){
    this.isOn.set('Marked')
  }

  // GetNextPage(){
  //   if(this.currentpage() < this.totalPages()){
  //     this.currentpage.update(val=>val+1);
  //     this.checkOnstatus()
  //   }
  // }

  // GetPreviousPage(){
  //   if(this.currentpage() > 0){
  //     this.currentpage.update(val=>val-1)
  //   }
  // }

loadMorePosts() {
    if (this.currentpage() >= this.totalPages() || this.loading()) return;

    const nextPage = this.currentpage() + 1
    this.loading.set(true);

    let request;
    const currentStatus = this.isOn();

    if (currentStatus == 'feed') {
      request = this.htppService.getFeedPosts(nextPage); 
    } else if (currentStatus == 'community') {
      request = this.htppService.getAllposts(nextPage);
    } else if (currentStatus == 'MyPosts') {
      request = this.htppService.getMyPosts(this.CookieUser()?._id!, nextPage);
    } else if (currentStatus == 'Marked') {
      request = this.htppService.getMarkedPosts(nextPage); 
    }

    if (request) {
      request.pipe(finalize(() => this.loading.set(false))).subscribe({
        next: (res) => {
          const posts = res.data.posts || res.data.bookmarks;
          if (posts && posts.length > 0) {
            this.Postslist.update(oldPosts => [...oldPosts, ...posts]);
            this.currentpage.set(res.meta.pagination.currentPage);
            this.totalPages.set(res.meta.pagination.numbrOfPages || res.meta.pagination.numberOfPages);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}