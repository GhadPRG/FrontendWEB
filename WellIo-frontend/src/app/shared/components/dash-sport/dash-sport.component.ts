import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dash-sport',
  standalone: true,
  imports: [],
  templateUrl: './dash-sport.component.html',
  styleUrl: './dash-sport.component.css'
})
export class DashSportComponent implements OnInit {
  
  constructor(private dashSerive: DashboardService) {}

  ngOnInit(): void {
    this.dashSerive.setHeaderText("Sport & Exercise");
  }

}
