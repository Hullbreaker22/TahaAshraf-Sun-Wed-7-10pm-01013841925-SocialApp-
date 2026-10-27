import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/errorinterceptor';
import { headerInterceptor } from './core/interceptors/header-interceptor';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
      provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en'
    }),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor,headerInterceptor,loadingInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes , withInMemoryScrolling({scrollPositionRestoration: 'top', anchorScrolling:'enabled'})), provideClientHydration(withEventReplay()),
    provideToastr({timeOut: 3000, progressBar: true, closeButton: true,  preventDuplicates: true,}),
    importProvidersFrom(NgxSpinnerModule),

    
  ]
};



