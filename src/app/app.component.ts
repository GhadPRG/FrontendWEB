import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from './shared/services/theme.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'WellIo-frontend';
  isDarkMode: boolean = false;
  themeColor = "blue";

  constructor(private themeService: ThemeService) {
  }

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    })

    this.themeService.themeColor$.subscribe((color) => {
      this.themeColor = color
    })
  }
}
