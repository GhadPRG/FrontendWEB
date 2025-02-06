import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { NutritionService } from '../../services/nutrition.service';
import { CommonModule } from '@angular/common';
import { SportService } from '../../services/sport.service';
import { MoodService } from '../../services/mood.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-dash-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-home.component.html',
  styleUrl: './dash-home.component.css'
})
export class DashHomeComponent implements OnInit {

  currMoodSelected = signal('');
  currentDate: Date = new Date() // Usiamo la data fornita

  userFullName!: string;
  constructor(
    private dashService: DashboardService,
    public nutritionService: NutritionService,
    public sportService: SportService,
    public moodService: MoodService
    private userService: UserService,
  )
  {
    this.userService.getUserFullName$().subscribe(name => this.userFullName = name)
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
