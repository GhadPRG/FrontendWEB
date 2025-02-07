import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { DataMappingService } from "./data-mapping.service"
import type { CalendarEvent, Category, Note, Tag } from "../utils/types/calendar.interface"

@Injectable({
  providedIn: "root",
})
export class EventNoteService {
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([])
  private notesSubject = new BehaviorSubject<Note[]>([])
  private categoriesSubject = new BehaviorSubject<Category[]>([])
  private tagSelectedSubject = new BehaviorSubject<number []>([])

  events$ = this.eventsSubject.asObservable()
  notes$ = this.notesSubject.asObservable()
  categories$ = this.categoriesSubject.asObservable()
  tagSelected$ = this.tagSelectedSubject.asObservable()

  constructor(private dataMappingService: DataMappingService) {
    this.loadInitialData()
  }

  private loadInitialData() {
    this.dataMappingService.getEvents().subscribe((events) => this.eventsSubject.next(events))
    this.dataMappingService.getNotes().subscribe((notes) => this.notesSubject.next(notes))
    this.dataMappingService.getCategories().subscribe((categories) => {
      this.categoriesSubject.next(categories)
    })
  }

  // Events
  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return new Observable<CalendarEvent>((observer) => {
      this.dataMappingService.addEvent(event).subscribe(
        (newEvent) => {
          const currentEvents = this.eventsSubject.value
          this.eventsSubject.next([...currentEvents, newEvent])
          observer.next(newEvent)
          observer.complete()
        },
        (error) => observer.error(error),
      )
    })
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return new Observable<CalendarEvent>((observer) => {
      this.dataMappingService.updateEvent(event).subscribe(
        (updatedEvent) => {
          const currentEvents = this.eventsSubject.value
          const updatedEvents = currentEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
          this.eventsSubject.next(updatedEvents)
          observer.next(updatedEvent)
          observer.complete()
        },
        (error) => observer.error(error),
      )
    })
  }

  deleteEvent(id: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.dataMappingService.deleteEvent(id).subscribe(
        () => {
          const currentEvents = this.eventsSubject.value
          const updatedEvents = currentEvents.filter((e) => e.id !== id)
          this.eventsSubject.next(updatedEvents)
          observer.next()
          observer.complete()
        },
        (error) => observer.error(error),
      )
    })
  }

  // Notes
  addNote(note: Note): Observable<Note> {
    return new Observable<Note>((observer) => {
      this.dataMappingService.addNote(note).subscribe(
        (newNote) => {
          const currentNotes = this.notesSubject.value
          this.notesSubject.next([...currentNotes, newNote])
          observer.next(newNote)
          observer.complete()
        },
        (error) => observer.error(error),
      )
    })
  }

  updateNote(note: Note): Observable<Note> {
    return new Observable<Note>((observer) => {
      this.dataMappingService.updateNote(note).subscribe(
        (updatedNote) => {
          const currentNotes = this.notesSubject.value
          const updatedNotes = currentNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
          this.notesSubject.next(updatedNotes)
          observer.next(updatedNote)
          observer.complete()
        },
        (error) => observer.error(error),
      )
    })
  }

  deleteNote(id: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.dataMappingService.deleteNote(id).subscribe(
        () => {
          const currentNotes = this.notesSubject.value
          const updatedNotes = currentNotes.filter((n) => n.id !== id)
          this.notesSubject.next(updatedNotes)
          observer.next()
          observer.complete()
        },
        (error) => observer.error(error),
      )
    })
  }

  // Helper method to get all tags from categories
  getAllTags(): Tag[] {
    return this.categoriesSubject.value.reduce((allTags: Tag[], category) => {
      return allTags.concat(category.tags || [])
    }, [])
  }

  updateSelectedTags(tagIds: number[]): void {
    this.tagSelectedSubject.next(tagIds)
  }

  // Helper method to get tags by category
  getTagsByCategory(categoryId: number): Tag[] {
    const category = this.categoriesSubject.value.find((c) => c.id === categoryId)
    return category ? category.tags || [] : []
  }
}

