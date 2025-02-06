import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { NutritionService } from '../../services/nutrition.service';
import { CommonModule } from '@angular/common';
import { SportService } from '../../services/sport.service';
import {UserService} from '../../services/user.service';
import {UserInfoInterface} from '../../utils/types/user.interfaces';

@Component({
  selector: 'app-dash-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-home.component.html',
  styleUrl: './dash-home.component.css'
})
export class DashHomeComponent implements OnInit {
  currentDate: Date = new Date() // Usiamo la data fornita
  userInfo: UserInfoInterface;
  constructor(
    private dashService: DashboardService,
    public nutritionService: NutritionService,
    public sportService: SportService,
    private userService: UserService,
  )
  {
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit(): void {
    this.dashService.setHeaderText('');

    // Start Services
    this.nutritionService.getTodayMeals();
    // this.sportService.getWeekExercise().subscribe({
    //   next: (response) => this.sportService.mapExericesToExerciseDictionary(
    //                       this.sportService.unflattenExercises(response))
    // });
  }

  refreshUserData(): void {
    this.userService.refreshUserInfo();
    // Aggiorna i dati locali dopo il refresh
    this.userInfo = this.userService.getUserInfo();
  }

  getFormattedDate(): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const dayName = days[this.currentDate.getDay()]
    const day = this.currentDate.getDate()
    const month = months[this.currentDate.getMonth()]
    const year = this.currentDate.getFullYear()

    return `${dayName}, ${day} ${month} ${year}`
  }
}
