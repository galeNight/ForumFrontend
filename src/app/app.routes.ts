import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { PostComponent } from './Components/post/post.component';
import { LoginComponent } from './Components/login/login.component';
import { TestComponent } from './Components/Misc/test/test.component';
import { ErrorComponent } from './Components/Misc/error/error.component';
import { ProfileComponent } from './Components/profile/profile.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent},
    { path: 'post/:id', component: PostComponent },
    {path: 'login', component: LoginComponent},
    { path: 'profile', component: ProfileComponent }, // Profile without ID
    { path: 'profile/:id', component: ProfileComponent }, // Profile with optional ID
    {path: 'test', component: TestComponent},
    {path: '**', component: ErrorComponent}
]