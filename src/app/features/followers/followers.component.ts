import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IPost } from '../../core/Models/Ipost.interface';
import { IUser } from '../../core/Models/iuser.interface';
import { PostsService } from '../../core/services/posts.service';
import { SplitPipe } from '../../core/Pipes/split-pipe';
import { PostActionsComponent } from '../../sharred/post-actions/post-actions.component';
import { PostImageComponent } from '../../sharred/post-image/post-image.component';
import { UsersService } from '../../core/services/users/users.service';
import { TranslatePipe } from '@ngx-translate/core';

interface IProfileUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  cover?: string;
}

@Component({
  selector: 'app-followers', 
  imports: [RouterLink, SplitPipe, PostActionsComponent, PostImageComponent, TranslatePipe],
  templateUrl:'./followers.component.html',
  styleUrl: './followers.component.css',
})
export class FollowersComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly UsersBase = inject(UsersService);
  private readonly PostBase = inject(PostsService);
  private readonly location = inject(Location);
  private readonly toastr = inject(ToastrService);

  ProfileId: WritableSignal<string> = signal('');
  Profile: WritableSignal<IProfileUser | null> = signal(null);
  Posts: WritableSignal<IPost[]> = signal([]);
  isFollowing: WritableSignal<boolean> = signal(false);
  SavedUserId: WritableSignal<IUser> = signal({} as IUser);
  activeSavedPostId: WritableSignal<string | null> = signal(null);

  ngOnInit() {
    this.getSavedUser();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id'); 
      if (id) {
        this.ProfileId.set(id);
        console.log(this.ProfileId());
        
        this.GetProfile();
        this.GetPosts();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.savedArea')) {
      this.activeSavedPostId.set(null);
    }
  }

  getSavedUser() {
    const stored = localStorage.getItem('SocialUser');
    if (stored) {
      this.SavedUserId.set(JSON.parse(stored));
    }
  }

  GetProfile() {
    this.UsersBase.getUserProfile(this.ProfileId()).subscribe({
      next: (res) => {
        console.log(res);
        console.log(this.ProfileId);
        
        this.Profile.set(res.data.user);                                  
        this.isFollowing.set(res.data.isFollowing ?? res.data.user?.isFollowing ?? false);
      },
      error: (err) =>{
        console.log(err)
          console.log(this.ProfileId());
      } 
    });
  }

  GetPosts() {
    this.PostBase.getMyPosts(this.ProfileId()).subscribe({
      next: (res) => {
        console.log(res);
        this.Posts.set(res.data.posts);                               
      },
      error: (err) => console.log(err),
    });
  }

  goBack() {
    this.location.back();
  }

  isOwner(): boolean {
    return this.Profile()?._id === this.SavedUserId()._id;
  }

  toggleFollow() {
    const user = this.Profile();
    if (!user) return;

    const prev = this.isFollowing();
    this.isFollowing.set(!prev);

    this.UsersBase.FolloUser(user._id).subscribe({
      error: () => this.isFollowing.set(prev), 
    });
  }

  toggleSavedList(postId: string) {
    this.activeSavedPostId.update(id => (id === postId ? null : postId));
  }

  BookmarkElement(postId: string) {
    this.PostBase.BookMarkPost(postId).subscribe({
      next: () => {
        this.Posts.update(list =>
          list.map(p => (p._id === postId ? { ...p, bookmarked: !p.bookmarked } : p))
        );
        this.activeSavedPostId.set(null);
      },
      error: (err) => console.log(err),
    });
  }

  DeleteThePost(postId: string) {
    this.PostBase.DeletePost(postId).subscribe({
      next: (res) => {
        this.toastr.success(res.success?.message, 'Post Deleted Successfully');
        this.Posts.update(list => list.filter(p => p._id !== postId));
        this.activeSavedPostId.set(null);
      },
      error: (err) => console.log(err),
    });
  }

  updateLocalPost(updated: IPost) {
    this.Posts.update(list => list.map(p => (p._id === updated._id ? updated : p)));
  }
}