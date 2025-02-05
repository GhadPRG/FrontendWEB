import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dash-home',
  standalone: true,
  imports: [],
  templateUrl: './dash-home.component.html',
  styleUrl: './dash-home.component.css'
})
export class DashHomeComponent implements OnInit {

  constructor(private dashSerive: DashboardService) {}

  ngOnInit(): void {
    this.dashSerive.setHeaderText("");
  }
  
}
