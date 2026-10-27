import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'split',
  standalone: true,
  pure: false
})
export class SplitPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: string | Date | undefined | null): string {
    if (!value) return '';

    const postDate = new Date(value);
    
    if (isNaN(postDate.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return this.translate.instant('timeAgo.justNow');
    }

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
      return `${minutes} ${this.translate.instant('timeAgo.m')}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${this.translate.instant('timeAgo.h')}`;
    }

    const days = Math.floor(hours / 24);
    if (days < 365) {
      return `${days} ${this.translate.instant('timeAgo.d')}`;
    }

    const years = Math.floor(days / 365);
    return `${years} ${this.translate.instant('timeAgo.y')}`;
  }
}