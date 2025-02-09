import { Component, OnInit } from "@angular/core"
import { DayViewComponent } from "../day-view/day-view.component"
import { NgClass, NgForOf, NgIf} from "@angular/common"
import { EventFormComponent } from "../forms/event-form/event-form.component"
import { DateTime } from "luxon"
import { CalendarEvent, Note, Tag } from "../../../utils/types/calendar.interface"
import { EventNoteService } from "../../../services/event-note.service"
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: "app-calendar-notes",
  standalone: true,
  imports: [
    DayViewComponent,
    NgIf,
    EventFormComponent,
    NgForOf,
    NgClass,
  ],
  templateUrl: "./calendar-notes.component.html",
  styleUrl: "./calendar-notes.component.css",
})
export class CalendarNotesComponent implements OnInit {
  currentMonth: DateTime = DateTime.local()
  calendar: DateTime[][] = []
  daysOfWeek: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  events: CalendarEvent[] = []
  notes: Note[] = []
  tags: Tag[] = []
  selectedTagIds: number[] = []

  isEventFormOpen = false
  selectedEvent: CalendarEvent | null = null
  selectedDay: DateTime | null = null

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]); // 🔄 Variabile reattiva
  events$ = this.eventsSubject.asObservable();

  constructor(
    private eventNoteService: EventNoteService,
  ) {}

  ngOnInit() {
    this.updateCalendar()
    this.loadData()
  }

  loadData()
  {
    this.eventNoteService.events$.subscribe((events) => {
      this.events = events
      this.eventsSubject.next(this.events)
      // Forza l'aggiornamento della vista
      this.updateCalendar()

    })

    this.eventNoteService.categories$.subscribe(() => {
      this.tags = this.eventNoteService.getAllTags()
      // Forza l'aggiornamento della vista
      this.updateCalendar()
    })

    this.eventNoteService.tagSelected$.subscribe((filteredTags) => {
      this.onFilterChange(filteredTags)
    })
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

  prevMonth() {
    this.currentMonth = this.currentMonth.minus({ months: 1 })
    this.updateCalendar()
  }

  nextMonth() {
    this.currentMonth = this.currentMonth.plus({ months: 1 })
    this.updateCalendar()
  }

  isCurrentMonth(date: DateTime): boolean {
    return date.hasSame(this.currentMonth, "month")
  }

  isToday(date: DateTime): boolean {
    return date.hasSame(DateTime.local(), "day")
  }

  selectDate(date: DateTime) {
    this.selectedDay = date
  }

  getEventsForDay(day: DateTime): (CalendarEvent & { color: string })[]
  {
    return this.eventsSubject.getValue()
      .filter((event) => {
        const eventStart = event.start.startOf('day');
        const eventEnd = event.end ? event.end.startOf('day') : eventStart;
        const currentDay = day.startOf('day');
        return currentDay >= eventStart && currentDay <= eventEnd;
      })
      .map((event) => ({
        ...event,
        color: this.getEventColor(event),
      }));
  }

  getEventColor(event: CalendarEvent): string {
    if (event.tags?.length > 0) {
      const firstTagId = event.tags[0]
      const tag = this.tags.find((t) => t.id === firstTagId)
      return tag ? tag.color : "#3498db" // Default color if tag not found
    }
    return "#3498db" // Default color if no tags
  }

  openEventForm(event?: CalendarEvent) {
    this.selectedEvent = event || null
    this.isEventFormOpen = true
    this.closeDayView()
  }

  closeEventForm() {
    this.isEventFormOpen = false
    this.selectedEvent = null
  }

  onFilterChange(selectedTagIds: number[]) {
    this.selectedTagIds = selectedTagIds
    this.eventsSubject.next(this.getFilteredEvents());
  }

  getFilteredEvents(): CalendarEvent[] {
    const allEvents = this.eventsSubject.getValue();
    if (this.selectedTagIds.length === 0) return allEvents
    return allEvents.filter((event) => event.tags.some((tagId) => this.selectedTagIds.includes(tagId)))
  }

  focusOnEvent(event: CalendarEvent) {
    const eventDate = event.start
    if (!eventDate.hasSame(this.currentMonth, "month")) {
      this.currentMonth = eventDate.startOf("month")
      this.updateCalendar()
    }
    this.selectedDay = eventDate
  }

  closeDayView() {
    this.selectedDay = null
  }

  getDaysArray(): DateTime[] {
    const start = this.currentMonth.startOf("month").startOf("week")
    const end = this.currentMonth.endOf("month").endOf("week")
    const days: DateTime[] = []

    let current = start
    while (current <= end) {
      days.push(current)
      current = current.plus({ days: 1 })
    }

    return days
  }
}

