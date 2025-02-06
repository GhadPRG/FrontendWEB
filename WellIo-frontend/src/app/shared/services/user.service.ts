import { Injectable } from '@angular/core';
import { UserInfoInterface } from '../utils/types/user.interfaces';
import {ApiService} from './api.service';
import {BehaviorSubject, catchError, Observable, tap} from 'rxjs';
import {MockDataService} from './mock-data.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  mockData: boolean = true;
  private userInfoSubject: BehaviorSubject<UserInfoInterface>
  private defaultUserInfo: UserInfoInterface = {
    firstName: "Caricamento...",
    lastName: "Caricamento...",
    email: "caricamento@esempio.com",
    birthDate: "1900-01-01",
    gender: "Non specificato",
    height: 0,
    weight: 0,
    dailyCalories: 0,
  }

  constructor(private apiService: ApiService, private mockDataService: MockDataService) {
    this.userInfoSubject = new BehaviorSubject<UserInfoInterface>(this.defaultUserInfo)
    this.mockData = this.mockDataService.useMockData;
    this.loadUserInfo()
  }

  private loadUserInfo(): void {
    if (this.mockData) {
      this.userInfoSubject.next(this.mockDataService.getMockUserInfo())
    } else {
      this.apiService
        .getUserInfo()
        .pipe(
          tap((userInfo) => this.userInfoSubject.next(userInfo)),
          catchError((error) => {
            console.error("Errore nel caricamento delle informazioni utente:", error)
            return []
          }),
        )
        .subscribe()
    }
  }

  // Metodi sincroni
  getUserInfo(): UserInfoInterface {
    return this.userInfoSubject.value
  }

  getUserFullName(): string {
    const user = this.userInfoSubject.value
    return `${user.firstName} ${user.lastName}`
  }

  getUserInitials(): string {
    const user = this.userInfoSubject.value
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : ""
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : ""
    return `${firstInitial}${lastInitial}`
  }

  getUserAge(): number {
    const user = this.userInfoSubject.value
    const birthDate = new Date(user.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Metodi Observable
  getUserInfo$(): Observable<UserInfoInterface> {
    return this.userInfoSubject.asObservable()
  }

  getUserFullName$(): Observable<string> {
    return this.getUserInfo$().pipe(map((user) => `${user.firstName} ${user.lastName}`))
  }

  getUserInitials$(): Observable<string> {
    return this.getUserInfo$().pipe(
      map((user) => {
        const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : ""
        const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : ""
        return `${firstInitial}${lastInitial}`
      }),
    )
  }

  getUserEmail$(): Observable<string> {
    return this.getUserInfo$().pipe(map((user) => user.email))
  }

  // Metodo per forzare l'aggiornamento dei dati
  refreshUserInfo(): void {
    this.loadUserInfo()
  }

  getUserAge$(): Observable<number> {
    return this.userInfoSubject.pipe(
      map((user) => {
        const birthDate = new Date(user.birthDate)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDifference = today.getMonth() - birthDate.getMonth()
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
      }),
    )
  }
}
