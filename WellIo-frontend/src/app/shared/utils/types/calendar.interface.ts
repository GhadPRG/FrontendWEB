import type { DateTime } from "luxon";


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
}

// Backend DTO interfaces
export interface EventDTO {
  id?: number
  categoryId?: number
  title: string
  description?: string
  startDate: string
  endDate?: string
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
  color?: string
}

export interface CategoryDTO {
  id?: number
  name: string
  description?: string
  color?: string
}

// Auth interfaces
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

