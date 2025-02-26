import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { APP_INITIALIZER, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { StorageService } from './storage.service';
import { LocalStorageService, StorageFactoryService } from './localstorage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: StorageService,
      useFactory: (storageFactory: StorageFactoryService) =>
        {
          const service = storageFactory.getStorageService();
          console.log('StorageService from Factory:', service);
          return service;
        },
      deps: [StorageFactoryService],
    },
  ],
};
