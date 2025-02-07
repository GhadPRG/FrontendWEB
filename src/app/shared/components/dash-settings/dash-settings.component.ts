import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import {NgClass} from '@angular/common';
import {ThemeService} from '../../services/theme.service';
import {UserService} from '../../services/user.service';
import {UserInfoInterface} from '../../utils/types/user.interfaces';

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
  userInfo: UserInfoInterface;

  constructor(private dashSerive: DashboardService,
              private themeService: ThemeService,
              private userService: UserService) {
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit(): void {
    this.dashSerive.setHeaderText("Your Settings");
    this.themeService.themeColor$.subscribe(theme => {
      this.selectedTheme = theme;
    })
  }

  setTheme(theme: string): void {
    this.themeService.setThemeColor(theme);
  }

  getAge(): number {
    return this.userService.getUserAge();
  }
}
