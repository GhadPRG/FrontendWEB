import { Routes } from '@angular/router';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { DashHomeComponent } from './shared/components/dash-home/dash-home.component';
import { DashSettingsComponent } from './shared/components/dash-settings/dash-settings.component';
import { DashFoodComponent } from './shared/components/dash-food/dash-food.component';
import { DashSportComponent } from './shared/components/dash-sport/dash-sport.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard', 
        component: DashboardComponent,
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
            }
        ]
    },
    {
        path: 'welcome-page', 
        loadComponent: () => import('./business/index/index.component').then((c) => c.IndexComponent)
    },
];
