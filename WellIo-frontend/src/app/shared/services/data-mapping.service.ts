import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
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
} from "../utils/types/calendar.interface"

@Injectable({
  providedIn: "root",
})
export class DataMappingService {
  private useMockData = true

  constructor(
    private apiService: ApiService,
    private mockDataService: MockDataService,
  ) {
    this.useMockData = this.mockDataService.useMockData
  }

  getEvents(): Observable<CalendarEvent[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getEvents())
    }
    return this.apiService
      .getEvents()
      .pipe(map((events) => events.map((event) => this.convertEventDTOToCalendarEvent(event))))
  }

  getNotes(): Observable<Note[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getNotes())
    }
    return this.apiService.getNotes().pipe(map((notes) => notes.map((note) => this.convertNoteDTOToNote(note))))
  }

  getTags(): Observable<Tag[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getTags())
    }
    return this.getCategories().pipe(
      map((categories) => {
        return categories.reduce((allTags: Tag[], category) => {
          const categoryTags =
            category.tags?.map((tag) => ({
              ...tag,
              categoryId: category.id,
              color: category.color || tag.color,
            })) || []
          return [...allTags, ...categoryTags]
        }, [])
      }),
    )
  }

  getCategories(): Observable<Category[]> {
    if (this.useMockData) {
      return of(this.mockDataService.getCategories())
    }
    return this.apiService
      .getCategories()
      .pipe(map((categories) => categories.map((category) => this.convertCategoryDTOToCategory(category))))
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (this.useMockData) {
      return of(this.mockDataService.addEvent(event))
    }
    return this.apiService
      .createEvent(this.convertCalendarEventToEventDTO(event))
      .pipe(map((eventDTO) => this.convertEventDTOToCalendarEvent(eventDTO)))
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (this.useMockData) {
      return of(this.mockDataService.updateEvent(event))
    }
    return this.apiService
      .updateEvent(this.convertCalendarEventToEventDTO(event))
      .pipe(map((eventDTO) => this.convertEventDTOToCalendarEvent(eventDTO)))
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
    return this.apiService
      .createNote(this.convertNoteToNoteDTO(note))
      .pipe(map((noteDTO) => this.convertNoteDTOToNote(noteDTO)))
  }

  updateNote(note: Note): Observable<Note> {
    if (this.useMockData) {
      return of(this.mockDataService.updateNote(note))
    }
    return this.apiService
      .updateNote(this.convertNoteToNoteDTO(note))
      .pipe(map((noteDTO) => this.convertNoteDTOToNote(noteDTO)))
  }

  deleteNote(id: number): Observable<void> {
    if (this.useMockData) {
      this.mockDataService.deleteNote(id)
      return of(undefined)
    }
    return this.apiService.deleteNote(id)
  }

  private convertEventDTOToCalendarEvent(dto: EventDTO): CalendarEvent {
    return {
      id: dto.id!,
      categoryId: dto.categoryId,
      title: dto.title,
      description: dto.description,
      start: DateTime.fromISO(dto.start),
      end: dto.end ? DateTime.fromISO(dto.end) : DateTime.fromISO(dto.start),
      tags: dto.tags ? dto.tags : [],
    }
  }

  private convertCalendarEventToEventDTO(event: CalendarEvent): EventDTO {
    return {
      id: event.id,
      categoryId: event.categoryId,
      title: event.title,
      description: event.description,
      start: event.start.toISO() ?? DateTime.now().toISO(),
      end: event.end?.toISO() ?? DateTime.now().toISO(),
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

  private convertTagDTOToTag(dto: TagDTO, categoryId: number, categoryColor: string): Tag {
    return {
      id: dto.id!,
      categoryId: categoryId,
      name: dto.name,
      description: dto.description,
      color: categoryColor,
    }
  }

  private convertCategoryDTOToCategory(dto: CategoryDTO): Category {
    return {
      id: dto.id!,
      name: dto.name,
      description: dto.description || "",
      color: dto.color || "",
      tags: dto.tags ? dto.tags.map((tagDto) => this.convertTagDTOToTag(tagDto, dto.id!, dto.color || "")) : [],
    }
  }
}

