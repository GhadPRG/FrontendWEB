import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dash-settings',
  standalone: true,
  imports: [],
  templateUrl: './dash-settings.component.html',
  styleUrl: './dash-settings.component.css'
})
export class DashSettingsComponent implements OnInit {

  constructor(private dashSerive: DashboardService) {}

  ngOnInit(): void {
    this.dashSerive.setHeaderText("Your Settings");
  }

}
