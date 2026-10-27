import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NavbarComponent } from '../../../sharred/navbar/navbar.component';
import { UsersService } from '../../../core/services/users/users.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IUser } from '../../../core/Models/iuser.interface';
import { PostsService } from '../../../core/services/posts.service';
import { IPost } from '../../../core/Models/Ipost.interface';
import { PostImageComponent } from '../../../sharred/post-image/post-image.component';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { SplitPipe } from '../../../core/Pipes/split-pipe';

@Component({
  selector: 'app-profile',
  imports: [RouterLink ,PostImageComponent , TranslatePipe , SplitPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit  {
  private readonly UserBase = inject(UsersService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly PostBase = inject(PostsService)
  private readonly toaster = inject(ToastrService)
  
  UserId = signal<string>('')
  CurrentUser = signal<IUser>({} as IUser)
  LocalUser = signal<IUser>({} as IUser)
  MyPosts = signal<IPost[]>([])
  SavedPosts = signal<IPost[]>([])
  isOnStatus = signal<boolean>(true)
  SelectedPostsList = computed(() => {return this.isOnStatus() ? this.MyPosts() : this.SavedPosts();});
  CoverImage:WritableSignal<File | null> = signal(null)
  ProfileImage:WritableSignal<File | null> = signal(null)



  ngOnInit(): void {
      this.getCurrentUser()
      this.activatedRoute.paramMap.subscribe(params => {
      const postId = params.get('id');
        if(postId){
          this.UserId.set(postId)
          this.getuser()
          this.getSavedPosts()
          this.getPosts()
        }
    });
  }

  getuser(){
    this.UserBase.getUserProfile(this.UserId()).subscribe({
      next:(res)=>{
       
        this.CurrentUser.set(res.data.user)

      },error:(err)=>{
        console.log(err);     
      }
    })
  }

  GetImageCover(e:Event){
    let input = e.target as HTMLInputElement
    if(input){
      if(input.files){
        this.CoverImage.set(input.files[0])
      }
    }

    

  }
  GetProfileImage(e:Event){
    let input = e.target as HTMLInputElement
    if(input){
      if(input.files){
        this.ProfileImage.set(input.files[0])
      }
    }

    let Dataset = new FormData
    Dataset.append('photo',this.ProfileImage()!)

    this.UserBase.UploadProfilePic(Dataset).subscribe({
      next:(res)=>{
        console.log(res);
        this.toaster.success('Profile Pic Updated Successfully!')
         this.getPosts()
          this.getCurrentUser()
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }

  getPosts(){
    this.PostBase.getMyPosts(this.UserId()).subscribe({
      next:(res)=>{

        if(res.data.posts){
        this.MyPosts.set(res.data.posts)       
       }
        
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }



  getSavedPosts(){
    this.PostBase.getMarkedPosts().subscribe({
      next:(res)=>{
        
        if(res.data.bookmarks){
          this.SavedPosts.set(res.data.bookmarks)
        }
      },error:(err)=>{
        console.log(err);
        
      }
    })
  }

  getCurrentUser(){
     let users = JSON.parse(localStorage.getItem('SocialUser')!)
    if(users){
       this.CurrentUser.set(users)
    }
  }


  timeFormula(theDate:string):string{
    let formatedTime = new Date(theDate)
    return formatedTime.toLocaleDateString('en-US',{
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    })
    
  }


  openMyPosts(){
    this.isOnStatus.set(true)
  }
  OpenSaved(){
    this.isOnStatus.set(false)
  }

}
