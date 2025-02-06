import { Injectable } from '@angular/core';
import { UserInfoInterface } from '../utils/types/user.interfaces';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {MockDataService} from './mock-data.service';

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
      this.userInfoSubject.next(this.defaultUserInfo)
    } else {
      this.apiService.getUserInfo().subscribe({
        next: (userInfo) => this.userInfoSubject.next(userInfo),
        error: (error) => console.error("Errore nel caricamento delle informazioni utente:", error),
      })
    }
  }

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

  refreshUserInfo(): void {
    this.loadUserInfo()
  }
}
