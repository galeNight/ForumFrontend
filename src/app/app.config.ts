import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Define the application configuration
export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the application routes using provideRouter
    provideRouter(routes),
    // Provide the HttpClient module
    provideHttpClient(),
    // Provide asynchronous animations
    provideAnimationsAsync()
  ]
};
