import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { FollowersComponent } from './features/followers/followers.component';
import { SuggestionsComponent } from './features/suggestions/suggestions.component';
import { SittingsComponent } from './features/sittings/sittings.component';
import { ThemeService } from './core/services/theme';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SocialApp');
  private readonly themeService = inject(ThemeService);
}
