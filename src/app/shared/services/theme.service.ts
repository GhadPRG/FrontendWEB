import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  private themeColor = new BehaviorSubject<string>("blue");

  constructor() {
    this.checkDarkMode();
    // Check if the user has a preferred theme stored
    const storedTheme = localStorage.getItem("theme")

    if (storedTheme) {
      this.setThemeColor(storedTheme);
    }
  }

  checkDarkMode() {
    const haveDark = localStorage.getItem("dark-mode");

    if (haveDark) {
      this.setDarkMode(haveDark === "dark")
    } else {
      // If no stored theme, check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      this.setDarkMode(prefersDark)
    }
  }

  isDarkMode$ = this.isDarkMode.asObservable()
  themeColor$ = this.themeColor.asObservable()

  setDarkMode(isDark: boolean) {
    this.isDarkMode.next(isDark)
    localStorage.setItem("dark-mode", isDark ? "dark" : "light")
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode.value)
  }

  setThemeColor(theme: string) {
    if (this.themeColor.value !== theme) {
      document.documentElement.classList.remove(this.themeColor.value);
      document.documentElement.classList.add(theme);
    }
    this.themeColor.next(theme);
    localStorage.setItem("theme", theme);

  }
}
