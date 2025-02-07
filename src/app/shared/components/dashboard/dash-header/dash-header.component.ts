import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dash-header.component.html',
  styleUrl: './dash-header.component.css'
})
export class DashHeaderComponent implements OnInit {

  headerText: string = ""; 

  constructor(private dashService: DashboardService) {} 

  ngOnInit(): void {
    
    // Setting Header Text
    this.dashService.getHeaderText().subscribe(
      (text) => {
        setTimeout(() => {
          this.headerText = text;
        });
      });
  }

}
