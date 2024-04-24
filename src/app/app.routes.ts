import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { PostComponent } from './Components/post/post.component';
import { LoginComponent } from './Components/login/login.component';
import { TestComponent } from './Components/Misc/test/test.component';
import { ErrorComponent } from './Components/Misc/error/error.component';
import { ProfileComponent } from './Components/profile/profile.component';
// Define the routes using the Routes array
export const routes: Routes = [
    {path: '', component: HomePageComponent}, // Default route to HomePageComponent when the path is empty
    { path: 'post/:id', component: PostComponent }, // Route to PostComponent with a parameter :id
    {path: 'login', component: LoginComponent}, // Route to LoginComponent
    { path: 'profile', component: ProfileComponent }, // Route to ProfileComponent without an ID
    { path: 'profile/:id', component: ProfileComponent }, // Route to ProfileComponent with an optional ID
    {path: 'test', component: TestComponent}, // Route to TestComponent
    {path: '**', component: ErrorComponent}, // Route to ErrorComponent for any other undefined routes
];