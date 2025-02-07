import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {NgIf} from '@angular/common';
import {VerticalTimelineComponent} from '../../calendar/vertical-timeline/vertical-timeline.component';

@Component({
  selector: 'app-sidecalendar-dashboard',
  standalone: true,
  imports: [
    NgIf,
    VerticalTimelineComponent
  ],
  templateUrl: './dash-side-calendar.component.html',
  styleUrl: './dash-side-calendar.component.css'
})
export class DashSideCalendarComponent implements AfterViewInit {

  // Side-Calendar Elements
  @ViewChild('toggleSideCalendarButton') toggleSidebarBtnRef!: ElementRef;
  @ViewChild('sideCalendar') sidebarRef!: ElementRef;

  isSideCalendarOpen = true;

  constructor() {}

  // SideBar Code & Functions
  ngAfterViewInit(): void {

    // Add Closing Functionality
    this.toggleSidebarBtnRef.nativeElement.addEventListener('click', () => this.toggleSideCalendar());
  }

  toggleSideCalendar(): void {
    this.isSideCalendarOpen = !this.isSideCalendarOpen;
    // Close Side-Calendar - Flip Toggle Button Icon
    this.sidebarRef.nativeElement.classList.toggle('closed');
    this.toggleSidebarBtnRef.nativeElement.children[0].classList.toggle('bx-rotate-180');
  }

}
