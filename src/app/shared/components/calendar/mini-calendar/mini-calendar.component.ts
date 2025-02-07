import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {CalendarEvent} from '../../../utils/types/calendar.interface';
import {DateTime} from 'luxon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mini-calendar',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './mini-calendar.component.html',
  styleUrl: './mini-calendar.component.css'
})
export class MiniCalendarComponent {
  @Input() events: CalendarEvent[] = []

  currentMonth: DateTime = DateTime.local()
  calendar: DateTime[][] = []
  daysOfWeek: string[] = ["L", "M", "M", "G", "V", "S", "D"]

  constructor(private router: Router) {
    this.updateCalendar()
  }

  updateCalendar() {
    const start = this.currentMonth.startOf("month").startOf("week")
    const end = this.currentMonth.endOf("month").endOf("week")

    this.calendar = []
    let currentWeek: DateTime[] = []

    for (let day = start; day <= end; day = day.plus({ days: 1 })) {
      currentWeek.push(day)

      if (currentWeek.length === 7) {
        this.calendar.push(currentWeek)
        currentWeek = []
      }
    }
  }

  prevMonth(event: Event) {
    event.stopPropagation()
    this.currentMonth = this.currentMonth.minus({ months: 1 })
    this.updateCalendar()
  }

  nextMonth(event: Event) {
    event.stopPropagation()
    this.currentMonth = this.currentMonth.plus({ months: 1 })
    this.updateCalendar()
  }

  isCurrentMonth(date: DateTime): boolean {
    return date.hasSame(this.currentMonth, "month")
  }

  isToday(date: DateTime): boolean {
    return date.hasSame(DateTime.local(), "day")
  }

  hasEvents(day: DateTime): boolean {
    return this.events.some((event) => event.start.hasSame(day, "day") || event.end.hasSame(day, "day"))
  }

  navigateToCalendar() {
    this.router.navigate(["/dashboard/calendar"])
  }
}
