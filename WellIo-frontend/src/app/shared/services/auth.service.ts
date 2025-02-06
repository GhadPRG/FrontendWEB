import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {LoginRequest, LoginResponse, RegisterRequest} from '../utils/types/auth.interface';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<LoginResponse | null>
  public currentUser: Observable<LoginResponse | null>

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(
      JSON.parse(localStorage.getItem("currentUser") || "null"),
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.apiService.login(loginRequest).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem("token", response.token)
          localStorage.setItem("currentUser", JSON.stringify(response))
          this.currentUserSubject.next(response)
          this.apiService.setToken(response.token)
        }
      }),
    )
  }

  register(registerRequest: RegisterRequest): Observable<void> {
    const dailyCalories = registerRequest.gender === "Male" ? registerRequest.weight * 32 : registerRequest.weight * 30
    const fullRequest = { ...registerRequest, dailyCalories }
    return this.apiService.register(fullRequest)
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
    this.apiService.clearToken()
    this.router.navigate(["/login"])
  }

}
