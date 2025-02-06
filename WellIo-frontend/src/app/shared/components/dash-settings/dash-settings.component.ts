import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import {NgClass} from '@angular/common';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-dash-settings',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './dash-settings.component.html',
  styleUrl: './dash-settings.component.css'
})
export class DashSettingsComponent implements OnInit {
  selectedTheme: string = "blue";

  constructor(private dashSerive: DashboardService,
              private themeService: ThemeService) {}

  ngOnInit(): void {
    this.dashSerive.setHeaderText("Your Settings");
    this.themeService.themeColor$.subscribe(theme => {
      this.selectedTheme = theme;
    })
  }

  setTheme(theme: string): void {
    this.themeService.setThemeColor(theme);
  }
}
