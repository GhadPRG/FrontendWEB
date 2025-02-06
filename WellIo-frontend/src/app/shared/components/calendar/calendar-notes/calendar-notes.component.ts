import {Component, OnInit} from '@angular/core';
import {DayViewComponent} from '../day-view/day-view.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NoteFormComponent} from '../forms/note-form/note-form.component';
import {EventFormComponent} from '../forms/event-form/event-form.component';
import {NotesGridComponent} from '../notes-grid/notes-grid.component';
import {TagFilterComponent} from '../tag-filter/tag-filter.component';
import {DateTime} from 'luxon';
import {CalendarEvent, Category, Note, Tag} from '../../../utils/types/calendar.interface';
import {EventNoteService} from '../../../services/event-note.service';
import {DashboardService} from '../../../services/dashboard.service';

@Component({
  selector: 'app-calendar-notes',
  standalone: true,
  imports: [
    DayViewComponent,
    NgIf,
    NoteFormComponent,
    EventFormComponent,
    NotesGridComponent,
    NgForOf,
    NgClass,
    TagFilterComponent
  ],
  templateUrl: './calendar-notes.component.html',
  styleUrl: './calendar-notes.component.css'
})
export class CalendarNotesComponent implements OnInit {
  currentMonth: DateTime = DateTime.local()
  calendar: DateTime[][] = []
  daysOfWeek: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  events: CalendarEvent[] = []
  notes: Note[] = []
  tags: Tag[] = []
  categories: Category[] = []
  selectedTagIds: number[] = []

  isEventFormOpen = false
  isNoteFormOpen = false
  selectedEvent: CalendarEvent | null = null
  selectedNote: Note | null = null
  selectedDay: DateTime | null = null

  constructor(private eventNoteService: EventNoteService,
              private dashService: DashboardService) {}

  ngOnInit() {
    this.dashService.setHeaderText('');
    this.updateCalendar()
    this.loadData()
  }

  loadData() {
    this.eventNoteService.events$.subscribe((events) => {
      this.events = events
    })

    this.eventNoteService.notes$.subscribe((notes) => {
      this.notes = notes
    })

    this.eventNoteService.tags$.subscribe((tags) => {
      this.tags = tags
    })

    this.eventNoteService.categories$.subscribe((categories) => {
      this.categories = categories
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

  getEventsForDay(day: DateTime): (CalendarEvent & { color: string })[] {
    return this.events
      .filter((event) => event.start.hasSame(day, "day") || (event.end && event.end.hasSame(day, "day")))
      .map((event) => ({
        ...event,
        color: this.getEventColor(event),
      }))
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
  }

  closeEventForm() {
    this.isEventFormOpen = false
    this.selectedEvent = null
  }

  saveEvent(event: CalendarEvent) {
    if (event.id) {
      this.eventNoteService.updateEvent(event).subscribe(() => {
        this.loadData()
      })
    } else {
      this.eventNoteService.addEvent(event).subscribe(() => {
        this.loadData()
      })
    }
    this.closeEventForm()
  }

  openNoteForm(note?: Note) {
    this.selectedNote = note || null
    this.isNoteFormOpen = true
  }

  closeNoteForm() {
    this.isNoteFormOpen = false
    this.selectedNote = null
  }

  saveNote(note: Note) {
    if (note.id) {
      this.eventNoteService.updateNote(note).subscribe(() => {
        this.loadData()
      })
    } else {
      this.eventNoteService.addNote(note).subscribe(() => {
        this.loadData()
      })
    }
    this.closeNoteForm()
  }


  deleteItem(item: CalendarEvent | Note) {
    if ("start" in item) {
      this.eventNoteService.deleteEvent(item.id).subscribe(() => this.loadData())
    } else {
      this.eventNoteService.deleteNote(item.id).subscribe(() => this.loadData())
    }
  }

  onFilterChange(selectedTagIds: number[]) {
    this.selectedTagIds = selectedTagIds
  }

  getFilteredEvents(): CalendarEvent[] {
    if (this.selectedTagIds.length === 0) return this.events
    return this.events.filter((event) => event.tags.some((tagId) => this.selectedTagIds.includes(tagId)))
  }

  getFilteredNotes(): Note[] {
    if (this.selectedTagIds.length === 0) return this.notes
    return this.notes.filter((note) => note.tags.some((tagId) => this.selectedTagIds.includes(tagId)))
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
