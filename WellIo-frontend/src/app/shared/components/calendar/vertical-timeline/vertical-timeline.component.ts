import { Component, type OnInit } from "@angular/core"
import { KeyValuePipe, NgForOf, NgIf } from "@angular/common"
import type { CalendarEvent, Tag } from "../../../utils/types/calendar.interface"
import { EventNoteService } from "../../../services/event-note.service"
import { DateTime } from "luxon"

@Component({
  selector: "app-vertical-timeline",
  standalone: true,
  imports: [NgForOf, NgIf, KeyValuePipe],
  templateUrl: "./vertical-timeline.component.html",
  styleUrl: "./vertical-timeline.component.css",
})
export class VerticalTimelineComponent implements OnInit {
  events: CalendarEvent[] = []
  tags: Tag[] = []
  groupedEvents: Map<string, CalendarEvent[]> = new Map()

  constructor(private eventNoteService: EventNoteService) {}

  ngOnInit(): void {
    this.loadEvents()
    this.loadTags()
  }

  loadEvents() {
    this.eventNoteService.events$.subscribe((events) => {
      this.events = events
      this.groupEventsByDate()
    })
  }

  loadTags() {
    this.eventNoteService.categories$.subscribe((categories) => {
      this.tags = this.eventNoteService.getAllTags()
    })
  }

  formatDate(date: string): string {
    return DateTime.fromISO(date).toFormat("EEEE, d MMMM")
  }

  groupEventsByDate() {
    this.groupedEvents = new Map()
    this.events.forEach((event) => {
      const date: any = event.start.toISODate()
      if (!this.groupedEvents.has(date)) {
        this.groupedEvents.set(date, [])
      }
      this.groupedEvents.get(date)?.push(event)
    })
    // Ordina gli eventi per ora di inizio
    this.groupedEvents.forEach((events, date) => {
      this.groupedEvents.set(
        date,
        events.sort((a, b) => a.start.toMillis() - b.start.toMillis()),
      )
    })
  }

  getTagColor(tagId: number): string {
    const tag = this.tags.find((t) => t.id === tagId)
    return tag ? tag.color : "#3498db"
  }
}

