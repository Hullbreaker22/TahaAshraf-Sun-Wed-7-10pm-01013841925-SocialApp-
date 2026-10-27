import { Routes } from '@angular/router';
import { AutholayoutComponent } from './layout/autholayout/autholayout.component';
import { LoginComponent } from './features/login/login/login.component';
import { RegisterComponent } from './features/register/register/register.component';
import { MainlayoutComponent } from './layout/mainlayout/mainlayout.component';
import { NotfoundComponent } from './features/notfound/notfound/notfound.component';
import { authGuard } from './core/guards/auth-guard';
import { mainGuard } from './core/guards/main-guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'',canActivate:[mainGuard],component:AutholayoutComponent,children:[
        {path:'login',component:LoginComponent,title:'Login | Route'},
        {path:'register',component:RegisterComponent,title:'Register | Route'}
    ]},
    
    {path:'',component:MainlayoutComponent,canActivate:[authGuard],children:[
        {path:'feeds',loadComponent:()=>import('./features/feeds/feeds/feeds.component').then((c)=>c.FeedsComponent),title:'Feeds | Route'},
        {path:'profile/:id',loadComponent:()=>import('./features/profile/profile/profile.component').then((c)=>c.ProfileComponent),title:'profile | Route'},
        {path:'suggestions',loadComponent:()=>import('./features/suggestions/suggestions.component').then((c)=>c.SuggestionsComponent),title:'suggestions | Route'},
        {path:'followers/:id',loadComponent:()=>import('./features/followers/followers.component').then((c)=>c.FollowersComponent),title:'Follower | Route'},
        {path:'sittings',loadComponent:()=>import('./features/sittings/sittings.component').then((c)=>c.SittingsComponent),title:'sittings | Route'},
        {path:'notifications',loadComponent:()=>import('./features/notifications/notifications/notifications.component').then((c)=>c.NotificationsComponent),title:'Notifications | Route'},
        {path:'original/:id',loadComponent:()=>import('./features/original-post/original-post.component').then((c)=>c.OriginalPostComponent),title:'OriginalPost | Route'},
        {path:'viewdetails/:id',loadComponent:()=>import('./features/view-details/view-details.component').then((c)=>c.ViewDetailsComponent),title:'ViewDetails | Route'}
    ]},
    {path:'**', component:NotfoundComponent, title:'Error | Not found'}
];
