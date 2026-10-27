import { IUser } from './../../../../core/Models/iuser.interface';
import { Component, inject, OnInit, signal, WritableSignal, viewChild, ElementRef, HostListener, InputSignal, input, computed, AfterViewInit, OnDestroy } from '@angular/core';
import { IPost } from '../../../../core/Models/Ipost.interface';
import { SpecialFeedService } from '../../../../core/services/FeedsServices/special-feed.service';
import { ReactiveFormsModule , FormControl, NgModel} from '@angular/forms';
import { PostsService } from '../../../../core/services/posts.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SplitPipe } from '../../../../core/Pipes/split-pipe';
import { PostActionsComponent } from '../../../../sharred/post-actions/post-actions.component';
import { PostImageComponent } from '../../../../sharred/post-image/post-image.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-middle-content',
  imports: [ReactiveFormsModule, RouterLink, SplitPipe, PostActionsComponent, PostImageComponent, TranslatePipe],
  templateUrl: './middle-content.component.html',
  styleUrl: './middle-content.component.css',
})
export class MiddleContentComponent implements OnInit {

  private readonly specialfeed = inject(SpecialFeedService)
  private readonly PostBsae = inject(PostsService)
  Postslist:WritableSignal<IPost[]> = this.specialfeed.Postslist
  allPages:WritableSignal<number> = this.specialfeed.totalPages
  currentpage: WritableSignal<number> = this.specialfeed.currentpage;
  PostId:WritableSignal<string> = signal('')
  ShowComment:WritableSignal<boolean> = signal(true)
  ImageFile: WritableSignal<File | null> = signal<File | null>(null);
  ImagePreview: WritableSignal<string | null> = signal<string | null>(null);
  Postbody:FormControl = new FormControl
  PostPrivacy:FormControl = new FormControl ('public')
  isEmpty = computed(() => !this.hasText() && !this.ImageFile());   
  textBody = viewChild<ElementRef<HTMLTextAreaElement>>('TextBody')
  selectedImage = signal<string | null>(null);
  activeCommentPostId = signal<string | null>(null);
  SavedUserId:WritableSignal<IUser | null> = signal({} as IUser)
  SavedListOpen = signal<boolean>(false)
  activeSavedPostId = signal<string | null>(null);
  IsSavedPost = signal<IPost>({} as IPost)
  Toastr =inject(ToastrService)
  Found:WritableSignal<boolean> = signal(false)
  showShareModal:WritableSignal<boolean> = signal(false)
  SharredPosted:WritableSignal<IPost> = signal({} as IPost)
  sharedTextBody = viewChild.required<ElementRef<HTMLTextAreaElement>>('sharedTextBody')
  hasText = signal<boolean>(false);
  showEmoji = signal<boolean>(false);
  activeEmojiTab = signal<string>('Feelings');
  observer:IntersectionObserver = new IntersectionObserver(() => {console.log('العنصر ظهر على الشاشة!');});
  myElement = viewChild<ElementRef<HTMLElement>>('myElement')
  showEditModal = signal<boolean>(false);
  editingPostId = signal<string | null>(null);
  EditPostBody: FormControl = new FormControl('');
  EditImageFile: WritableSignal<File | null> = signal<File | null>(null);
  EditImagePreview: WritableSignal<string | null> = signal<string | null>(null);
  isLoading = signal<boolean>(false);


  emojiTabs = [
  { name: 'Feelings', icon: '😊', list: ['😀','😃','😄','😁','😆','😅','😂','🤣','🙂','😉','😊','😍','🥰','😘','😋','😎','🤩','🥳','😏','😴','😢','😭','😡','🤯','😱','🤔','🙄','🥺','😇','🤗','😬','🤤'] },
  { name: 'Activities', icon: '⚽', list: ['⚽','🏀','🏈','🎾','🏐','🎱','🏓','🥊','🏋️','🚴','🏊','🧘','🎮','🎧','🎬','🎨','🎸','🎤','📚','✈️','🚗','🏖️','🏕️','🎉','🎂','🎁','☕','💻','📸','🛒','🏠','💼'] },
  { name: 'Food', icon: '🍕', list: ['🍕','🍔','🍟','🌭','🌮','🌯','🥗','🍝','🍜','🍣','🍤','🍗','🥩','🍞','🧀','🥚','🍎','🍌','🍉','🍇','🍓','🥑','🍩','🍪','🍰','🍫','🍦','🍿','🥤','🍺','🍷','☕'] },
  { name: 'Symbols', icon: '❤️', list: ['❤️','🧡','💛','💚','💙','💜','🖤','💔','💯','🔥','✨','⭐','🎯','👍','👎','👏','🙌','🙏','💪','👀','🤝','✌️','👋','🤞','✅','❌','⚡','🌈','☀️','🌙','🎵','💡'] },
];
activeEmojis = computed(() => this.emojiTabs.find(t => t.name === this.activeEmojiTab())?.list ?? []);

ngOnInit(): void {
    this.specialfeed.checkOnstatus(); 
    this.GetSavedUser();  
    this.specialfeed.getFeedPosts();
    this.Postslist.set(this.specialfeed.Postslist());

this.observer = new IntersectionObserver((entries) => {
  const entry = entries[0];
  if (
    entry.isIntersecting &&
    this.currentpage() < this.allPages() &&
    !this.specialfeed.loading()
  ) {
    this.loadNextPage();
  }
});
  }


  ngAfterViewInit(): void {
  const element = this.myElement();
  this.observer.observe(element!.nativeElement);
}



  
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
    
  if (!target.closest('.FavList')) {
    this.activeSavedPostId.set(null);
  }

  if (!target.closest('.emojiArea')) {
    this.showEmoji.set(false);
  }
}
openEditModal(post: IPost) {
    this.editingPostId.set(post._id);
    this.EditPostBody.setValue(post.body || '');
    this.EditImagePreview.set(post.image || null);
    this.EditImageFile.set(null);
    this.showEditModal.set(true);
    this.activeSavedPostId.set(null); 
    document.body.style.overflow = 'hidden'; 
}


closeEditModal() {
    this.showEditModal.set(false);
    this.editingPostId.set(null);
    this.EditPostBody.setValue('');
    this.EditImagePreview.set(null);
    this.EditImageFile.set(null);
    document.body.style.overflow = 'auto'; 
}

  ReadEditUploadedImg(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      this.EditImageFile.set(input.files[0]);
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        this.EditImagePreview.set(event.target?.result as string);
      };
      fileReader.readAsDataURL(input.files[0]);
    }
  }


submitUpdatePost() {
    const postId = this.editingPostId();
    if (!postId) return;

    const formData = new FormData();
    formData.append('body', this.EditPostBody.value);
    
    const imageFile = this.EditImageFile();
    if (imageFile) {
      formData.append('image', imageFile);
    }

    this.PostBsae.UpdatePost(postId, formData).subscribe({
      next: (res) => {
        this.Toastr.success('Post Updated Successfully', 'Success');
        this.closeEditModal();
        
        if (this.specialfeed.isOn() == 'feed') {
          this.specialfeed.getFeedPosts();
        } else if (this.specialfeed.isOn() == 'MyPosts') {
          this.specialfeed.getMyPosts();
        } else if (this.specialfeed.isOn() == 'community') {
          this.specialfeed.getAllposts();
        }
        this.Postslist.set(this.specialfeed.Postslist());
      },
      error: (err) => {
        console.log(err);
        this.Toastr.error('Failed to update post', 'Error');
      }
    });
  }

loadNextPage() {
  this.specialfeed.loadMorePosts();
}

toggleSavedList(PostId: string) {
  if (this.activeSavedPostId() === PostId) {
    this.activeSavedPostId.set(null);
  } else {
    this.activeSavedPostId.set(PostId);
  }
}

checkUserLiked(LikesList: string[]): boolean {
  const userId = this.SavedUserId()?._id;
  if (!userId || !LikesList) return false;
  
  return LikesList.includes(userId);
}

changeStatus() {
  const value = this.textBody()?.nativeElement.value;
  this.hasText.set(!!value && value.trim().length > 0);
}




 GetSavedUser(): void {
    const storedUser = localStorage.getItem('SocialUser');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        this.SavedUserId.set(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        this.SavedUserId.set(null);
      }
    } else {
      this.SavedUserId.set(null);
    }

  }

 toggleComments(postId: string) {
  if (this.activeCommentPostId() === postId) {
    this.activeCommentPostId.set(null);
  } else {
    this.activeCommentPostId.set(postId);
  }

}


  ReadUploadedImg(e:Event){
    let input = e.target as HTMLInputElement  
    if(input){
      if(input.files){   
        this.ImageFile.set(input.files[0])
      }
    }
    this.UploadedPhotoreader()
  }


UploadedPhotoreader(): void {
  const file = this.ImageFile();

  if (file) {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.ImagePreview.set(e.target?.result as string);
    };
    fileReader.readAsDataURL(file);
  }
}


CreatePost(e:SubmitEvent, formElement?:HTMLFormElement){
  e.preventDefault()

  const form = e.target as HTMLFormElement;
  let formData = new FormData
  let TheImage = this.ImageFile()
  formData.append('body', this.Postbody.value)
  if (TheImage !== null) {
    formData.append('image', TheImage)
  }
  formData.append('privacy', this.PostPrivacy.value)

  this.PostBsae.CreatePost(formData).subscribe({
    next: (res) => {
      form.reset(); 
      
      this.Postbody.setValue('');
      this.ImageFile.set(null);
      this.ImagePreview.set(null);
      this.hasText.set(false); 

      this.Toastr.success('Post Created Successfully!')
      
      if(this.specialfeed.isOn() == 'feed'){
        this.specialfeed.getFeedPosts()
      }else if(this.specialfeed.isOn() == 'MyPosts'){
          this.specialfeed.getMyPosts()
      }else if(this.specialfeed.isOn() == 'community'){
         this.specialfeed.getAllposts()
      }
      this.Postslist.set(this.specialfeed.Postslist())
      
    }, error: (err) => {
      console.log(err);
    }
  })
}

openImageModal(imageUrl: string): void {
  this.selectedImage.set(imageUrl);
  document.body.style.overflow = 'hidden'; 
}

closeImageModal(): void {
  this.selectedImage.set(null);
  document.body.style.overflow = 'auto'; 
}

BookMarkPost(Post: IPost) {
  this.PostBsae.BookMarkPost(Post._id).subscribe({
    next: (res) => {

      const newBookmarkState = !Post.bookmarked;
      this.Postslist.update(posts => 
        posts.map(p => {
          if (p._id === Post._id) {
            return { ...p, bookmarked: newBookmarkState };
          }
          return p;
        })
      );

      if (newBookmarkState) {
        this.Toastr.success('Post saved successfully', 'Saved');
      } else {
        this.Toastr.info('Post removed from saved items', 'Removed');
      }

      if(this.specialfeed.isOn() =='Marked'){
        this.Postslist.update(posts => posts.filter(post => post._id !== Post._id));
      }
    },
    error: (err) => {
      console.log(err);
      this.Toastr.error('Failed to update bookmark', 'Error');
    }
  });
}

DeleteThePost(postId:string){
  this.PostBsae.DeletePost(postId).subscribe({
    next:(res)=>{
           this.Toastr.success(res.success.message,'Post Deleted Successfully')

     console.log(res);
      if(this.specialfeed.isOn()== 'feed'){
        this.specialfeed.getFeedPosts()
         this.Postslist.set(this.specialfeed.Postslist())
      }else if(this.specialfeed.isOn()== 'MyPosts'){
          this.specialfeed.getMyPosts()
         this.Postslist.set(this.specialfeed.Postslist())
      }else if(this.specialfeed.isOn()== 'community'){
         this.specialfeed.getAllposts()
         this.Postslist.set(this.specialfeed.Postslist())
      }
    },error:(err)=>{
      console.log(err);    
    }
  })
}


toggleEmoji() {
  this.showEmoji.update(v => !v);
}

LikethePost(PostId:string){
  this.PostBsae.LikePost(PostId).subscribe({
    next:(res)=>{
      console.log(res);
      if(this.specialfeed.isOn()== 'feed'){
        this.specialfeed.getFeedPosts()
         this.Postslist.set(this.specialfeed.Postslist())
      }else if(this.specialfeed.isOn()== 'MyPosts'){
          this.specialfeed.getMyPosts()
         this.Postslist.set(this.specialfeed.Postslist())
      }else if(this.specialfeed.isOn()== 'community'){
         this.specialfeed.getAllposts()
         this.Postslist.set(this.specialfeed.Postslist())
      }
      
    },error:(err)=>{
      console.log(err);   
    }
  })
}  


addEmoji(emoji: string) {
  const el = this.textBody()?.nativeElement;
  const current: string = this.Postbody.value ?? '';
  const start = el?.selectionStart ?? current.length;
  const end = el?.selectionEnd ?? current.length;

  this.Postbody.setValue(current.slice(0, start) + emoji + current.slice(end));
  this.hasText.set(true);

  const pos = start + emoji.length;
  requestAnimationFrame(() => {
    el?.focus();
    el?.setSelectionRange(pos, pos);
  });
}


removeImage() {
  this.ImageFile.set(null);
  this.ImagePreview.set(null);
}


SharredPost(posId: string) {

  let input = this.sharedTextBody().nativeElement;
  let result = input.value.trim();

  let bodyContent = result ? result : `Sharing this great post @${this.SharredPosted().user?.username}`;
    if(this.specialfeed.isOn()== 'feed'){
        this.specialfeed.getFeedPosts()
      }else if(this.specialfeed.isOn()== 'MyPosts'){
          this.specialfeed.getMyPosts()
      }else if(this.specialfeed.isOn()== 'community'){
         this.specialfeed.getAllposts()
      }
      this.Postslist.set(this.specialfeed.Postslist())

  let requestBody = {
    body: bodyContent
  };

  this.PostBsae.SharePost(posId, requestBody).subscribe({
    next: (res) => {
      console.log(res);
    },
    error: (err) => {
      console.log(err);
    }
  });
}

openShareedModel(post:IPost){
  this.showShareModal.set(true)
  this.SharredPosted.set(post)
  document.body.style.overflow = 'hidden'; 
}

CloseSharredModel(){
  this.showShareModal.set(false)
  document.body.style.overflow = 'auto'; 
}
updateLocalPost(updatedPost: IPost) {
  this.Postslist.update(posts => 
    posts.map(p => p._id === updatedPost._id ? updatedPost : p)
  );
}

}
