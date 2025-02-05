import { Injectable } from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs"
import {DataMappingService} from './data-mapping.service';
import {CalendarEvent, Category, Note, Tag} from '../utils/types/calendar.interface';


@Injectable({
  providedIn: "root",
})
export class EventNoteService {
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([])
  private notesSubject = new BehaviorSubject<Note[]>([])
  private tagsSubject = new BehaviorSubject<Tag[]>([])
  private categoriesSubject = new BehaviorSubject<Category[]>([])

  events$ = this.eventsSubject.asObservable()
  notes$ = this.notesSubject.asObservable()
  tags$ = this.tagsSubject.asObservable()
  categories$ = this.categoriesSubject.asObservable()

  constructor(private dataMappingService: DataMappingService) {
    this.loadInitialData()
  }

  private loadInitialData() {
    // Assuming we have a way to get the current user's ID
    const userId = 1 // This should be replaced with the actual user ID

    this.dataMappingService.getEvents(userId).subscribe((events) => this.eventsSubject.next(events))
    this.dataMappingService.getNotes(userId).subscribe((notes) => this.notesSubject.next(notes))
    this.dataMappingService.getCategories().subscribe((categories) => {
      this.categoriesSubject.next(categories)
      categories.forEach((category) => {
        this.dataMappingService.getTags(category.id).subscribe((tags) => {
          this.tagsSubject.next([...this.tagsSubject.value, ...tags])
        })
      })
    })
  }

  // Events
  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.dataMappingService.addEvent(event)
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.dataMappingService.updateEvent(event)
  }

  deleteEvent(id: number): Observable<void> {
    return this.dataMappingService.deleteEvent(id)
  }

  // Notes
  addNote(note: Note): Observable<Note> {
    return this.dataMappingService.addNote(note)
  }

  updateNote(note: Note): Observable<Note> {
    return this.dataMappingService.updateNote(note)
  }

  deleteNote(id: number): Observable<void> {
    return this.dataMappingService.deleteNote(id)
  }

  // Tags
  addTag(tag: Tag): Observable<Tag> {
    return this.dataMappingService.addTag(tag)
  }

  updateTag(tag: Tag): Observable<Tag> {
    return this.dataMappingService.updateTag(tag)
  }

  deleteTag(id: number): Observable<void> {
    return this.dataMappingService.deleteTag(id)
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.dataMappingService.getCategories()
  }
}

