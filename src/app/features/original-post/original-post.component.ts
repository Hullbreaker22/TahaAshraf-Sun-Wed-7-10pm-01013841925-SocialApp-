import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { IPost } from '../../core/Models/Ipost.interface';
import { IUser } from '../../core/Models/iuser.interface';
import { SplitPipe } from '../../core/Pipes/split-pipe';
import { PostActionsComponent } from '../../sharred/post-actions/post-actions.component';
import { ToastrService } from 'ngx-toastr';
import { PostImageComponent } from '../../sharred/post-image/post-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-original-post',
  imports: [SplitPipe, PostActionsComponent, PostImageComponent, RouterLink, TranslatePipe, ReactiveFormsModule],
  templateUrl: './original-post.component.html',
  styleUrl: './original-post.component.css',
})
export class OriginalPostComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly PostBase = inject(PostsService);
  private readonly location = inject(Location);
  private readonly toastr = inject(ToastrService);

  PostId: WritableSignal<string> = signal('');
  SelectedPost: WritableSignal<IPost | null> = signal(null);
  SavedUserId: WritableSignal<IUser> = signal({} as IUser);
  IsSavedOpen: WritableSignal<boolean> = signal(false);

  // متغيرات الـ Edit Post Modal
  IsUpdateModalOpen: WritableSignal<boolean> = signal(false);
  UpdatedPostBody: FormControl = new FormControl('');
  UpdatedPostImage: WritableSignal<string | null> = signal(null);
  UpdatedImageFile: WritableSignal<File | null> = signal(null);
  isImageRemoved: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.getSavedUser();
    this.activatedRoute.paramMap.subscribe(params => {
      const postId = params.get('id');
      if (postId) {
        this.PostId.set(postId);
        this.GetSelectedPost();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.savedArea')) {
      this.IsSavedOpen.set(false);
    }
  }

  GetSelectedPost() {
    this.PostBase.getSinglePost(this.PostId()).subscribe({
      next: (res) => this.SelectedPost.set(res.data.post),
      error: (err) => console.log(err),
    });
  }

  goBack() {
    this.location.back();
  }

  getSavedUser() {
    const stored = localStorage.getItem('SocialUser');
    if (stored) {
      this.SavedUserId.set(JSON.parse(stored));
    }
  }

  toggleSavedStatus() {
    this.IsSavedOpen.update(val => !val);
  }

  BookmarkElement(postId: string) {
    this.PostBase.BookMarkPost(postId).subscribe({
      next: () => {
        this.SelectedPost.update(p => (p ? { ...p, bookmarked: !p.bookmarked } : p));
        this.IsSavedOpen.set(false);
      },
      error: (err) => console.log(err),
    });
  }

  onPostUpdated(updated: IPost) {
    this.SelectedPost.set(updated);
  }

  DeleteThePost(postId: string) {
    this.PostBase.DeletePost(postId).subscribe({
      next: (res) => {
        this.toastr.success(res.success?.message, 'Post Deleted Successfully');
        this.IsSavedOpen.set(false);
        this.goBack();
      },
      error: (err) => console.log(err),
    });
  }

  // فتح Modal التعديل وتعبئة البيانات القديمة للبوست
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
        this.toastr.success('Post Updated Successfully');
        this.GetSelectedPost();
        this.CloseUpdateModal();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}