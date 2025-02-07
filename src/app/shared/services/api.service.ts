import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import type { CategoryDTO, EventDTO, NoteDTO } from "../utils/types/calendar.interface"
import type { LoginRequest, LoginResponse, RegisterRequest } from "../utils/types/auth.interface"
import type { UserInfoInterface } from "../utils/types/user.interfaces"

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = "http://localhost:8080/api"
  private token: string | null = localStorage.getItem("token") ? localStorage.getItem("token") : null

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
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest)
  }

  register(registerRequest: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, registerRequest)
  }

  // Events CRUD
  getEvents(): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.baseUrl}/calendar`, { headers: this.getHeaders() })
  }

  createEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(`${this.baseUrl}/calendar`, event, { headers: this.getHeaders() })
  }

  updateEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.baseUrl}/events/${event.id}`, event, { headers: this.getHeaders() })
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`, { headers: this.getHeaders() })
  }

  // Notes CRUD
  getNotes(): Observable<NoteDTO[]> {
    return this.http.get<NoteDTO[]>(`${this.baseUrl}/notes`, { headers: this.getHeaders() })
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

  // Categories CRUD (now includes tags)
  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.baseUrl}/categories`, { headers: this.getHeaders() })
  }

  getUserInfo(): Observable<UserInfoInterface> {
    return this.http.get<UserInfoInterface>(`${this.baseUrl}/user`, { headers: this.getHeaders() })
  }
}

