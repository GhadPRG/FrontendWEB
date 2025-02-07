import { Injectable } from "@angular/core";
import { DateTime } from "luxon";
import {CalendarEvent, Category, Note, Tag} from '../utils/types/calendar.interface';
import {UserInfoInterface} from '../utils/types/user.interfaces';


@Injectable({
  providedIn: "root",
})
export class MockDataService {
  useMockData: boolean = true;

  private events: CalendarEvent[] = [
    {
      id: 1,
      title: "Sample Event",
      description: "This is a sample event",
      start: DateTime.local(),
      end: DateTime.local().plus({ hours: 2 }),
      tags: [1, 2],
    },
  ]

  private notes: Note[] = [
    {
      id: 1,
      title: "Sample Note",
      content: "This is a sample note",
      createdAt: DateTime.local(),
      tags: [1],
    },
  ]

  private tags: Tag[] = [
    {
      id: 1,
      categoryId: 1,
      name: "Work",
      description: "Work-related tasks",
      color: "#ff0000",
    },
    {
      id: 2,
      categoryId: 1,
      name: "Personal",
      description: "Personal tasks",
      color: "#00ff00",
    },
  ]

  private categories: Category[] = [
    {
      id: 1,
      name: "General",
      description: "General category",
      color: "#0000ff",
    },
  ]

  getEvents(): CalendarEvent[] {
    return this.events
  }

  getNotes(): Note[] {
    return this.notes
  }

  getTags(): Tag[] {
    return this.tags
  }

  getCategories(): Category[] {
    return this.categories
  }

  addEvent(event: CalendarEvent): CalendarEvent {
    const newEvent = { ...event, id: this.generateId() }
    this.events.push(newEvent)
    return newEvent
  }

  updateEvent(event: CalendarEvent): CalendarEvent {
    const index = this.events.findIndex((e) => e.id === event.id)
    if (index !== -1) {
      this.events[index] = event
    }
    return event
  }

  deleteEvent(id: number): void {
    this.events = this.events.filter((e) => e.id !== id)
  }

  addNote(note: Note): Note {
    const newNote = { ...note, id: this.generateId() }
    this.notes.push(newNote)
    return newNote
  }

  updateNote(note: Note): Note {
    const index = this.notes.findIndex((n) => n.id === note.id)
    if (index !== -1) {
      this.notes[index] = note
    }
    return note
  }

  deleteNote(id: number): void {
    this.notes = this.notes.filter((n) => n.id !== id)
  }

  getMockUserInfo(): UserInfoInterface {
    return {
      firstName: "Mario",
      lastName: "Rossi",
      email: "mario.rossi@example.com",
      birthDate: "1990-01-01",
      gender: "Maschio",
      height: 175,
      weight: 70,
      dailyCalories: 2000,
    }
  }

    private generateId(): number {
    return Math.floor(Math.random() * 1000000)
  }
}

