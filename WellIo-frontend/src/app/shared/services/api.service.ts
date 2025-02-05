import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CategoryDTO,
  EventDTO,
  LoginRequest,
  LoginResponse,
  NoteDTO,
  RegisterRequest,
  TagDTO
} from '../utils/types/calendar.interface';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:8080/api"
  private token: string | null = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTczODc2NzIzOCwiZXhwIjoxNzM4ODUzNjM4fQ.5bqjKZceZhBALsq-voAH8iFfOy-Tz7HfzJS3J1TENzY"

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders()
    if (this.token) {
      headers = headers.set("Authorization", `Bearer ${this.token}`)
    }
    return headers
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, loginRequest)
  }

  register(registerRequest: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/register`, registerRequest)
  }

  // Events CRUD
  getEvents(userId: number): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/events/user/${userId}`, { headers: this.getHeaders() })
  }

  createEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(`${this.baseUrl}/events`, event, { headers: this.getHeaders() })
  }

  updateEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.baseUrl}/events/${event.id}`, event, { headers: this.getHeaders() })
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`, { headers: this.getHeaders() })
  }

  // Notes CRUD
  getNotes(userId: number): Observable<NoteDTO[]> {
    return this.http.get<NoteDTO[]>(`${this.baseUrl}/notes/user/${userId}`, { headers: this.getHeaders() })
  }

  createNote(note: NoteDTO): Observable<NoteDTO> {
    return this.http.post<NoteDTO>(`${this.baseUrl}/notes`, note, { headers: this.getHeaders() })
  }

  updateNote(note: NoteDTO): Observable<NoteDTO> {
    return this.http.put<NoteDTO>(`${this.baseUrl}/notes/${note.id}`, note, { headers: this.getHeaders() })
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notes/${id}`, { headers: this.getHeaders() })
  }

  // Tags CRUD
  getTags(categoryId: number): Observable<TagDTO[]> {
    return this.http.get<TagDTO[]>(`${this.baseUrl}/tags/category/${categoryId}`, { headers: this.getHeaders() })
  }

  createTag(tag: TagDTO): Observable<TagDTO> {
    return this.http.post<TagDTO>(`${this.baseUrl}/tags`, tag, { headers: this.getHeaders() })
  }

  updateTag(tag: TagDTO): Observable<TagDTO> {
    return this.http.put<TagDTO>(`${this.baseUrl}/tags/${tag.id}`, tag, { headers: this.getHeaders() })
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tags/${id}`, { headers: this.getHeaders() })
  }

  // Categories CRUD
  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/categories`, { headers: this.getHeaders() })
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(`${this.baseUrl}/categories`, category, { headers: this.getHeaders() })
  }

  updateCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(`${this.baseUrl}/categories/${category.id}`, category, {
      headers: this.getHeaders(),
    })
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`, { headers: this.getHeaders() })
  }
}
