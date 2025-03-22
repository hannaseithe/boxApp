import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { StorageService } from './services/storage.service';
import { StorageFactoryService } from './services/localstorage.service';
import { provideHttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';

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
      useFactory: (storageFactory: StorageFactoryService) => {
        const service = storageFactory.getStorageService();
        console.log('StorageService from Factory:', service);
        return service;
      },
      deps: [StorageFactoryService],
    },
    provideHttpClient(),
    {
      provide: 'icon-setup',
      useFactory: () => {
        const iconRegistry = inject(MatIconRegistry);
        iconRegistry.registerFontClassAlias('material-symbols-outlined');
        return true;
      },
    },
  ],
};
