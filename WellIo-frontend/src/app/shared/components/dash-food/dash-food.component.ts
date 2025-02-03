import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dash-food',
  standalone: true,
  imports: [],
  templateUrl: './dash-food.component.html',
  styleUrl: './dash-food.component.css'
})
export class DashFoodComponent implements OnInit {

  constructor(private dashSerive: DashboardService) {}

  ngOnInit(): void {
    this.dashSerive.setHeaderText("Nutrition");
  }


}
