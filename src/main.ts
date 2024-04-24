import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Bootstrap the Angular application with the provided component and application configuration
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
