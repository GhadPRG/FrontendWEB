import { Routes } from '@angular/router';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { DashHomeComponent } from './shared/components/dash-home/dash-home.component';

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
            }
        ]
    },
    {
        path: 'welcome-page', 
        loadComponent: () => import('./business/index/index.component').then((c) => c.IndexComponent)
    },
];
