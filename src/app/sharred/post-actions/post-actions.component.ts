import { Component, ElementRef, inject, input, OnInit, output, signal, viewChild, WritableSignal } from '@angular/core';
import { IPost } from '../../core/Models/Ipost.interface';
import { CommentsComponent } from '../../features/feeds/feeds/comments/comments.component';
import { PostsService } from '../../core/services/posts.service';
import { IUser } from '../../core/Models/iuser.interface';
import { SplitPipe } from '../../core/Pipes/split-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-actions',
  standalone: true,
  imports: [CommentsComponent, SplitPipe , TranslatePipe], 
  templateUrl: './post-actions.component.html',
  styleUrl: './post-actions.component.css'
})
export class PostActionsComponent implements OnInit {
  post = input.required<IPost>();
  currentUserId = input<string | undefined>();
  
  private readonly PostBase = inject(PostsService);
private readonly Toastr = inject(ToastrService);
  activeCommentPostId = signal<string | null>(null);
  showShareModal: WritableSignal<boolean> = signal(false);
  SharredPosted: WritableSignal<IPost> = signal({} as IPost);
  sharedTextBody = viewChild.required<ElementRef<HTMLTextAreaElement>>('sharedTextBody');
  SavedUserId: WritableSignal<IUser> = signal({} as IUser);
  isCommentsOpen = signal<boolean>(false);
  likeUpdated = output<IPost>(); 
  likeClicked = output<string>();


  ngOnInit(): void {
    this.getSaveduser();
  }

  isLiked(): boolean {
    const userId = this.currentUserId() || this.SavedUserId()?._id;
    const likes = this.post().likes;
    if (!userId || !likes) return false;
    return likes.includes(userId);
  }

  toggleComments(postId: string) {
    if (this.activeCommentPostId() === postId) {
      this.activeCommentPostId.set(null);
    } else {
      this.activeCommentPostId.set(postId);
    }
  }

  getSaveduser(){
    const stored = localStorage.getItem('SocialUser');
    if (stored) {
      this.SavedUserId.set(JSON.parse(stored));
    }
  }

  
LikethePost(postId: string) {
  const userId = this.currentUserId() || this.SavedUserId()?._id;
  if (!userId) return;

  const old = this.post();
  const wasLiked = this.isLiked();
  const likes = old.likes ?? [];

  this.likeUpdated.emit({
    ...old,
    likes: wasLiked ? likes.filter(id => id !== userId) : [...likes, userId],
    likesCount: (old.likesCount ?? 0) + (wasLiked ? -1 : 1),
  });

  this.PostBase.LikePost(postId).subscribe({
    error: () => this.likeUpdated.emit(old), 
  });
}

SharredPost(posId: string) {
    let inputElem = this.sharedTextBody()?.nativeElement;
    let result = inputElem ? inputElem.value.trim() : '';

    let bodyContent = result ? result : `Sharing this great post @${this.SharredPosted().user?.username}`;

    let requestBody = {
      body: bodyContent
    };

    this.PostBase.SharePost(posId, requestBody).subscribe({
      next: (res) => {
        console.log(res);
        this.Toastr.success('Post shared successfully', 'Success');
        this.CloseSharredModel();
      },
      error: (err) => {
        console.log(err);
        this.Toastr.error('Failed to share post', 'Error');
      }
    });
  }

  openShareedModel(post: IPost){
    this.showShareModal.set(true);
    this.SharredPosted.set(post);
  }

  CloseSharredModel(){
    this.showShareModal.set(false);
  }
}