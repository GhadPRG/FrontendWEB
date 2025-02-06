import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { NutritionService } from '../../services/nutrition.service';
import { CommonModule } from '@angular/common';
import { SportService } from '../../services/sport.service';
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-dash-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-home.component.html',
  styleUrl: './dash-home.component.css'
})
export class DashHomeComponent implements OnInit {

  currMoodSelected = signal('');

  constructor(
    private dashService: DashboardService,
    public nutritionService: NutritionService,
    public sportService: SportService,
    public moodService: MoodService
  ) 
  {}

  ngOnInit(): void {
    this.dashService.setHeaderText('');

    // Start Services
    this.nutritionService.getTodayMeals();
    this.sportService.getWeekExercise().subscribe({
      next: (response) => {
        const unflattenResponse = this.sportService.unflattenExercises(response);

        this.sportService.mapExericesToExerciseDictionary(unflattenResponse);
      }
    });
    this.moodService.getMoods();
  }

  addMoodByType(moodType: string): void {
    this.moodService.registerNewMood({
      moodLevel: this.moodService.moodTypes.indexOf(moodType) + 1,
      moodDate: new Date().toISOString().split("T")[0],
      notes: ''
    });

    this.currMoodSelected.set(moodType);
  }
  
}
