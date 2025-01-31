import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-sidecalendar-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dash-side-calendar.component.html',
  styleUrl: './dash-side-calendar.component.css'
})
export class DashSideCalendarComponent implements AfterViewInit {
  
  // Side-Calendar Elements
  @ViewChild('toggleSideCalendarButton') toggleSidebarBtnRef!: ElementRef;
  @ViewChild('sideCalendar') sidebarRef!: ElementRef;

  constructor(private dashService: DashboardService) {}

  // SideBar Code & Functions
  ngAfterViewInit(): void {

    // Add Closing Functionality
    this.toggleSidebarBtnRef.nativeElement.addEventListener('click', () => this.toggleSideCalendar());
  }

  toggleSideCalendar(): void {
    // Close Side-Calendar - Flip Toggle Button Icon
    this.sidebarRef.nativeElement.classList.toggle('closed');
    this.toggleSidebarBtnRef.nativeElement.children[0].classList.toggle('bx-rotate-180');
  }

}
