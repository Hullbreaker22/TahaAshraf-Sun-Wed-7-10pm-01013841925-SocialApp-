import { Component, inject, WritableSignal } from '@angular/core';
import { LeftsideComponent } from './leftside/leftside.component';
import { MiddleContentComponent } from './middle-content/middle-content.component';
import { RightsideComponent } from './rightside/rightside.component';
import { SpecialFeedService } from '../../../core/services/FeedsServices/special-feed.service';
import { FollowersComponent } from '../../followers/followers.component';

@Component({
  selector: 'app-feeds',
  imports: [LeftsideComponent, MiddleContentComponent, RightsideComponent ],
  templateUrl: './feeds.component.html',
  styleUrl: './feeds.component.css',
})
export class FeedsComponent {
  private readonly feedspcial = inject(SpecialFeedService)
  isLoading:WritableSignal<boolean> = this.feedspcial.loading
}

