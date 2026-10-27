import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class myTranslate {
  private readonly translationService = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  lang = signal<'en' | 'ar'>('en');

  constructor() {
    this.translationService.setFallbackLang('en');

    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('lang');
      this.setLanguage(saved === 'ar' ? 'ar' : 'en');
    }
  }

  setLanguage(lang: 'en' | 'ar') {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('lang', lang);
    this.translationService.use(lang);
    this.lang.set(lang);

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  
}