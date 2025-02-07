import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core"
import {NgForOf, NgIf} from "@angular/common"
import type {DateTime} from "luxon"
import type {CalendarEvent, Tag} from "../../../utils/types/calendar.interface"
import {EventNoteService} from '../../../services/event-note.service';

@Component({
  selector: "app-day-view",
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: "./day-view.component.html",
  styleUrl: "./day-view.component.css",
})
export class DayViewComponent implements OnInit {
  @Input() isOpen = false
  @Input() date!: DateTime
  @Input() events: CalendarEvent[] = []
  @Output() closeView = new EventEmitter<void>()
  @Output() createEvent = new EventEmitter<CalendarEvent>()
  @Output() editEventEmitter = new EventEmitter<CalendarEvent>()

  tags: Tag[] = []
  constructor(private eventNoteService: EventNoteService) {
  }

  ngOnInit() {
    this.eventNoteService.categories$.subscribe(() => {
      this.tags = this.eventNoteService.getAllTags()
    })
  }

  hours: number[] = Array.from({ length: 24 }, (_, i) => i)

  close() {
    this.closeView.emit()
  }

  getEventTopPosition(event: CalendarEvent): number {
    const startOfDay = this.date.startOf("day")
    const eventStart = event.start < startOfDay ? startOfDay : event.start
    return eventStart.diff(startOfDay, "minutes").minutes
  }

  getEventHeight(event: CalendarEvent): number {
    const startOfDay = this.date.startOf("day")
    const endOfDay = this.date.endOf("day")
    const eventStart = event.start < startOfDay ? startOfDay : event.start
    const eventEnd = event.end > endOfDay ? endOfDay : event.end
    const durationInMinutes = eventEnd.diff(eventStart, "minutes").minutes
    return Math.max(durationInMinutes, 30) // Minimo 30px di altezza
  }

  getEventColor(event: CalendarEvent): string {
    if (event.tags?.length > 0) {
      const firstTagId = event.tags[0]
      const tag = this.tags.find((t) => t.id === firstTagId)
      return tag ? tag.color : "#3498db"
    }
    return "#3498db"
  }

  getEventLeft(event: CalendarEvent, index: number): string {
    const overlappingEvents = this.getOverlappingEvents(event)
    const position = overlappingEvents.findIndex((e) => e.id === event.id)
    const offset = 5 + position * 2 // 5% di margine iniziale, 2% per ogni evento sovrapposto
    return `${offset}%`
  }

  getEventWidth(event: CalendarEvent, index: number): string {
    const overlappingEvents = this.getOverlappingEvents(event)
    const maxWidth = 90 // Larghezza massima 90%
    const width = maxWidth / Math.max(overlappingEvents.length, 1)
    return `${Math.min(width, 85)}%` // Massimo 85% per evento singolo
  }

  getOverlappingEvents(event: CalendarEvent): CalendarEvent[] {
    return this.events
      .filter(
        (e) =>
          e.start < event.end &&
          e.end > event.start &&
          (e.start.hasSame(this.date, "day") ||
            e.end.hasSame(this.date, "day") ||
            (e.start < this.date.startOf("day") && e.end > this.date.endOf("day"))),
      )
      .sort((a, b) => a.start.toMillis() - b.start.toMillis())
  }

  createEventAtTime(hour: number) {
    this.close()
    const start = this.date.set({ hour, minute: 0 })
    const end = start.plus({ hours: 1 })
    const newEvent: CalendarEvent = {
      id: 0,
      title: "",
      description: "",
      start,
      end,
      tags: [],
    }
    this.createEvent.emit(newEvent)
  }

  editEvent(event: CalendarEvent) {
    this.close()
    this.editEventEmitter.emit(event)
  }

  isMultiDayEvent(event: CalendarEvent): boolean {
    return !event.start.hasSame(event.end, "day")
  }

  getEventTimeLabel(event: CalendarEvent): string {
    if (this.isMultiDayEvent(event)) {
      if (event.start.hasSame(this.date, "day")) {
        return `Inizia: ${event.start.toFormat("HH:mm")} - Termina: ${event.end.toFormat("dd/MM HH:mm")}`
      } else if (event.end.hasSame(this.date, "day")) {
        return `Iniziato: ${event.start.toFormat("dd/MM HH:mm")} - Termina: ${event.end.toFormat("HH:mm")}`
      } else {
        return `${event.start.toFormat("dd/MM HH:mm")} - ${event.end.toFormat("dd/MM HH:mm")}`
      }
    }
    return `${event.start.toFormat("HH:mm")} - ${event.end.toFormat("HH:mm")}`
  }

  isEventContinuingFromPreviousDay(event: CalendarEvent): boolean {
    return event.start < this.date.startOf("day")
  }

  isEventContinuingToNextDay(event: CalendarEvent): boolean {
    return event.end > this.date.endOf("day")
  }

  getEventsForDay(): CalendarEvent[] {
    return this.events.filter(
      (event) =>
        event.start.hasSame(this.date, "day") ||
        event.end.hasSame(this.date, "day") ||
        (event.start < this.date.startOf("day") && event.end > this.date.endOf("day")),
    )
  }
}

