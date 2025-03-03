import { Routes } from '@angular/router';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { DashHomeComponent } from './shared/components/dash-home/dash-home.component';
import { DashSettingsComponent } from './shared/components/dash-settings/dash-settings.component';
import { DashFoodComponent } from './shared/components/dash-food/dash-food.component';
import { DashSportComponent } from './shared/components/dash-sport/dash-sport.component';
import { DashMoodComponent } from './shared/components/dash-mood/dash-mood.component';
import {LoginComponent} from './business/login/login.component';
import {authGuard} from './shared/utils/guards/auth.guard';
import {RegisterComponent} from './business/register/register.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: DashHomeComponent
            },
            {
                path: 'food',
                component: DashFoodComponent
            },
            {
                path: 'sport',
                component: DashSportComponent
            },
            {
                path: 'settings',
                component: DashSettingsComponent
            },
            {
                path: 'mood',
                component: DashMoodComponent
            },
          {
            path: 'calendar',
            loadComponent: () => import('./business/calendar/calendar.component').then((c) => c.CalendarComponent)
          }

        ]
    },
    {
        path: 'welcome-page',
        loadComponent: () => import('./business/index/index.component').then((c) => c.IndexComponent)
    },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  }
];
