import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false)

  constructor() {
    // Check if the user has a preferred theme stored
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme) {
      this.setDarkMode(storedTheme === "dark")
    } else {
      // If no stored theme, check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      this.setDarkMode(prefersDark)
    }
  }

  isDarkMode$ = this.isDarkMode.asObservable()

  setDarkMode(isDark: boolean) {
    this.isDarkMode.next(isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode.value)
  }
}
