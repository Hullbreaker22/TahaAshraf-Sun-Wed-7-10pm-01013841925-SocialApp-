import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { SpecialFeedService } from '../../../../core/services/FeedsServices/special-feed.service';
import { TranslatePipe } from '@ngx-translate/core';
import { UsersService } from '../../../../core/services/users/users.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-leftside',
  imports: [TranslatePipe],
  templateUrl: './leftside.component.html',
  styleUrl: './leftside.component.css',
})
export class LeftsideComponent {
  private readonly specialfeed = inject(SpecialFeedService);
  private readonly userBase = inject(AuthService)
  buttons = viewChildren<ElementRef<HTMLButtonElement>>('leftBTN');

  isCollapsed = signal<boolean>(false);

  toggleCollapse(): void {
    this.isCollapsed.update((val) => !val);
  }

  activeFeed(): void {
    this.specialfeed.FeedOn();
    this.specialfeed.checkOnstatus();
    this.updateActiveState(0);
  }

  activeMyPosts(): void {
    this.specialfeed.myPostsOn();
    this.specialfeed.checkOnstatus();
    this.updateActiveState(1);
  }

  activeCommunity(): void {
    this.specialfeed.CommunityOn();
    this.specialfeed.checkOnstatus();
    this.updateActiveState(2);
  }

  ActiveMarked(): void {
    this.specialfeed.MarkedOn();
    this.specialfeed.checkOnstatus();
    this.updateActiveState(3);
  }

  logout(): void {
    this.userBase.Logout()
  }

  private updateActiveState(activeIndex: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.buttons().forEach((btn, index) => {
      const element = btn.nativeElement;
      if (index === activeIndex) {
        element.classList.add('bg-[#e7f3ff]', 'dark:bg-blue-950/60', 'text-[#1877f2]', 'dark:text-blue-400');
        element.classList.remove('text-slate-700', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      } else {
        element.classList.remove('bg-[#e7f3ff]', 'dark:bg-blue-950/60', 'text-[#1877f2]', 'dark:text-blue-400');
        element.classList.add('text-slate-700', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      }
    });
  }
}