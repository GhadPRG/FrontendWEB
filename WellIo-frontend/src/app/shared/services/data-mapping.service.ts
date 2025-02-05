import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import { map } from "rxjs/operators"
import { ApiService } from "./api.service"
import { MockDataService } from "./mock-data.service"
import { DateTime } from "luxon"
import type {
  CalendarEvent,
  Note,
  Tag,
  Category,
  EventDTO,
  NoteDTO,
  TagDTO,
  CategoryDTO,
} from "../utils/types/calendar.interface";

@Injectable({
  providedIn: "root",
})
export class DataMappingService {
  private useMockData = true

  constructor(
    private apiService: ApiService,
    private mockDataService: MockDataService,
  ) {}

  getEvents(userId: number): Observable<CalendarEvent[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getEvents())
    }
    return this.apiService.getEvents(userId).pipe(map((events) => events.map(this.convertEventDTOToCalendarEvent)))
  }

  getNotes(userId: number): Observable<Note[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getNotes())
    }
    return this.apiService.getNotes(userId).pipe(map((notes) => notes.map(this.convertNoteDTOToNote)))
  }

  getTags(categoryId: number): Observable<Tag[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getTags())
    }
    return this.apiService.getTags(categoryId).pipe(map((tags) => tags.map(this.convertTagDTOToTag)))
  }

  getCategories(): Observable<Category[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getCategories())
    }
    return this.apiService.getCategories().pipe(map((categories) => categories.map(this.convertCategoryDTOToCategory)))
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (this.useMockData) {
      return of(this.mockDataService.addEvent(event))
    }
    return this.apiService
      .createEvent(this.convertCalendarEventToEventDTO(event))
      .pipe(map(this.convertEventDTOToCalendarEvent))
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (this.useMockData) {
      return of(this.mockDataService.updateEvent(event))
    }
    return this.apiService
      .updateEvent(this.convertCalendarEventToEventDTO(event))
      .pipe(map(this.convertEventDTOToCalendarEvent))
  }

  deleteEvent(id: number): Observable<void> {
    if (this.useMockData) {
      this.mockDataService.deleteEvent(id)
      return of(undefined)
    }
    return this.apiService.deleteEvent(id)
  }

  addNote(note: Note): Observable<Note> {
    if (this.useMockData) {
      return of(this.mockDataService.addNote(note))
    }
    return this.apiService.createNote(this.convertNoteToNoteDTO(note)).pipe(map(this.convertNoteDTOToNote))
  }

  updateNote(note: Note): Observable<Note> {
    if (this.useMockData) {
      return of(this.mockDataService.updateNote(note))
    }
    return this.apiService.updateNote(this.convertNoteToNoteDTO(note)).pipe(map(this.convertNoteDTOToNote))
  }

  deleteNote(id: number): Observable<void> {
    if (this.useMockData) {
      this.mockDataService.deleteNote(id)
      return of(undefined)
    }
    return this.apiService.deleteNote(id)
  }

  addTag(tag: Tag): Observable<Tag> {
    if (this.useMockData) {
      return of(this.mockDataService.addTag(tag))
    }
    return this.apiService.createTag(this.convertTagToTagDTO(tag)).pipe(map(this.convertTagDTOToTag))
  }

  updateTag(tag: Tag): Observable<Tag> {
    if (this.useMockData) {
      return of(this.mockDataService.updateTag(tag))
    }
    return this.apiService.updateTag(this.convertTagToTagDTO(tag)).pipe(map(this.convertTagDTOToTag))
  }

  deleteTag(id: number): Observable<void> {
    if (this.useMockData) {
      this.mockDataService.deleteTag(id)
      return of(undefined)
    }
    return this.apiService.deleteTag(id)
  }

  private convertEventDTOToCalendarEvent(dto: EventDTO): CalendarEvent {
    return {
      id: dto.id!,
      categoryId: dto.categoryId,
      title: dto.title,
      description: dto.description,
      start: DateTime.fromISO(dto.startDate),
      end: dto.endDate ? DateTime.fromISO(dto.endDate) : DateTime.fromISO(dto.startDate),
      tags: dto.tags,
    }
  }

  private convertCalendarEventToEventDTO(event: CalendarEvent): EventDTO {
    return {
      id: event.id,
      categoryId: event.categoryId,
      title: event.title,
      description: event.description,
      startDate: event.start.toISO() ?? DateTime.now().toISO(),
      endDate: event.end?.toISO() ?? DateTime.now().toISO(),
      tags: event.tags,
    }
  }

  private convertNoteDTOToNote(dto: NoteDTO): Note {
    return {
      id: dto.id!,
      title: dto.title,
      content: dto.content,
      createdAt: DateTime.fromISO(dto.createdAt),
      tags: dto.tags,
    }
  }

  private convertNoteToNoteDTO(note: Note): NoteDTO {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISO() ?? DateTime.now().toISO(),
      tags: note.tags,
    }
  }

  private convertTagDTOToTag(dto: TagDTO): Tag {
    return {
      id: dto.id!,
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description,
      color: dto.color || "#0000ff",
    }
  }

  private convertTagToTagDTO(tag: Tag): TagDTO {
    return {
      id: tag.id,
      categoryId: tag.categoryId,
      name: tag.name,
      description: tag.description,
      color: tag.color,
    }
  }

  private convertCategoryDTOToCategory(dto: CategoryDTO): Category {
    return {
      id: dto.id!,
      name: dto.name,
      description: dto.description || "",
      color: dto.color || "",
    }
  }
}

