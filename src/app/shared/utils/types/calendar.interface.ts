import type { DateTime } from "luxon"

export interface CalendarEvent {
  id: number
  categoryId?: number
  title: string
  description?: string
  start: DateTime
  end: DateTime
  tags: number[]
}

export interface Note {
  id: number
  title: string
  content: string
  createdAt: DateTime
  tags: number[]
}

export interface Tag {
  id: number
  categoryId: number
  name: string
  description?: string
  color: string
}

export interface Category {
  id: number
  name: string
  description?: string
  color?: string
  tags?: Tag[]
}

// Backend DTO interfaces
export interface EventDTO {
  id?: number
  categoryId?: number
  title: string
  description?: string
  start: string
  end?: string
  tags: number[]
}

export interface NoteDTO {
  id?: number
  title: string
  content: string
  createdAt: string
  tags: number[]
}

export interface TagDTO {
  id?: number
  categoryId: number
  name: string
  description?: string
}

export interface CategoryDTO {
  id?: number
  name: string
  description?: string
  color?: string
  tags?: TagDTO[]
}

