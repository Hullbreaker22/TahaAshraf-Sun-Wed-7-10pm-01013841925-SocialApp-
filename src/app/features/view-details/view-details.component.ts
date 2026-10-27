import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Icomments } from '../../core/Models/icomments.interface';
import { IPost } from '../../core/Models/Ipost.interface';
import { CommentsService } from '../../core/services/CommentsServices/comments.service';
import { PostsService } from '../../core/services/posts.service';
import { Location } from '@angular/common';
import { SplitPipe } from '../../core/Pipes/split-pipe';
import { IUser } from '../../core/Models/iuser.interface';
import { PostActionsComponent } from '../../sharred/post-actions/post-actions.component';
import { PostImageComponent } from '../../sharred/post-image/post-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-details',
  imports: [RouterLink, SplitPipe, PostActionsComponent, PostImageComponent, TranslatePipe, ReactiveFormsModule],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css',
})
export class ViewDetailsComponent {

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const postId = params.get('id');
      if (postId) {
        this.PostId.set(postId);
        this.GetSelectedPost();
        this.getSavedUser();
      }
    });
  }

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly CommentsBase = inject(CommentsService);
  private readonly PostBsae = inject(PostsService);
  PostId: WritableSignal<string> = signal('');
  private readonly PostBase = inject(PostsService);
  SelectedPost: WritableSignal<IPost | null> = signal(null);
  commentsList: WritableSignal<Icomments[]> = signal([]);
  topComment: WritableSignal<Icomments | null> = signal(null);
  private readonly location = inject(Location);
  isCommentsOpen: WritableSignal<boolean> = signal(false);
  SavedUserId: WritableSignal<IUser> = signal({} as IUser);
  IsSavedOpen: WritableSignal<boolean> = signal(false);

  IsUpdateModalOpen: WritableSignal<boolean> = signal(false);
  UpdatedPostBody: FormControl = new FormControl('');
  UpdatedPostImage: WritableSignal<string | null> = signal(null);
  UpdatedImageFile: WritableSignal<File | null> = signal(null);
  isImageRemoved: WritableSignal<boolean> = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.savedArea')) {
      this.IsSavedOpen.set(false);
    }
  }

  GetSelectedPost() {
    this.PostBase.getSinglePost(this.PostId()).subscribe({
      next: (res) => {
        this.SelectedPost.set(res.data.post);
        this.GetComments();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  GetComments() {
    this.CommentsBase.getPostComments(this.PostId()).subscribe({
      next: (res) => {
        this.commentsList.set(res.data.comments);
        this.topComment.set(this.commentsList()[0]);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  OpenComments() {
    this.isCommentsOpen.update(val => !val);
  }

  getSavedUser() {
    let savedLocal = JSON.parse(localStorage.getItem('SocialUser')!);
    if (savedLocal) {
      this.SavedUserId.set(savedLocal);
    }
  }

  toggleSavedStatus() {
    this.IsSavedOpen.update(val => !val);
  }

  BookmarkElement(postId: string) {
    this.PostBase.BookMarkPost(postId).subscribe({
      next: (res) => {
        this.GetSelectedPost();
        this.IsSavedOpen.set(false);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ToggleBookmark(postId: string) {
    this.BookmarkElement(postId);
  }

  OpenUpdateModal() {
    const post = this.SelectedPost();
    if (post) {
      this.UpdatedPostBody.setValue(post.body || '');
      this.UpdatedPostImage.set(post.image || null);
      this.IsUpdateModalOpen.set(true);
      this.IsSavedOpen.set(false);
    }
  }

  CloseUpdateModal() {
    this.IsUpdateModalOpen.set(false);
    this.UpdatedPostImage.set(null);
    this.UpdatedImageFile.set(null);
    this.isImageRemoved.set(false);
  }

  ReadUpdatedPostImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.UpdatedImageFile.set(file);
      this.isImageRemoved.set(false);
      const reader = new FileReader();
      reader.onload = () => {
        this.UpdatedPostImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  UpdatePostSubmit(event: Event) {
    event.preventDefault();
    const postId = this.SelectedPost()?._id;
    if (!postId) return;

    const formData = new FormData();
    formData.append('body', this.UpdatedPostBody.value);
    
    if (this.UpdatedImageFile()) {
      formData.append('image', this.UpdatedImageFile()!);
    }

    this.PostBase.UpdatePost(postId, formData).subscribe({
      next: (res) => {
        this.GetSelectedPost();
        this.CloseUpdateModal();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  LikethePost(postId: string) {
    this.PostBsae.LikePost(postId).subscribe({
      next: (res) => {
        this.GetSelectedPost();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}