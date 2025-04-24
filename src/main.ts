import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { appRoutes } from './app/app.routes';  // routing 
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // making api requests
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideHttpClient(), // making api requests
    importProvidersFrom(IonicStorageModule.forRoot({
      name: 'recipe_finder_db',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }))
  ],
});
  