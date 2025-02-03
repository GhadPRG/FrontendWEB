import { Component } from '@angular/core';
import { DashboardService } from '../../shared/services/dashboard.service';

import { DashHeaderComponent } from "../../shared/components/dashboard/dash-header/dash-header.component";
import { DashSidebarComponent } from '../../shared/components/dashboard/dash-sidebar/dash-sidebar.component';
import { DashSideCalendarComponent } from "../../shared/components/dashboard/dash-side-calendar/dash-side-calendar.component";

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, DashSidebarComponent, DashHeaderComponent, DashSideCalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private dashService: DashboardService) {}

  // Sidebar Function 
  isSidebarMenuOpened(): boolean {
    return this.dashService.isSideBarMenuOpened();
  }
}
