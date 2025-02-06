import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { NutritionService } from '../../services/nutrition.service';
import { CommonModule } from '@angular/common';
import { SportService } from '../../services/sport.service';

@Component({
  selector: 'app-dash-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-home.component.html',
  styleUrl: './dash-home.component.css'
})
export class DashHomeComponent implements OnInit {

  constructor(
    private dashService: DashboardService,
    public nutritionService: NutritionService,
    public sportService: SportService,
  ) 
  {}

  ngOnInit(): void {
    this.dashService.setHeaderText('');

    // Start Services
    this.nutritionService.getTodayMeals();
    // this.sportService.getWeekExercise().subscribe({
    //   next: (response) => this.sportService.mapExericesToExerciseDictionary(
    //                       this.sportService.unflattenExercises(response))
    // });
  }
  
}
