import { Component } from '@angular/core';
import { DashHeaderComponent } from "../dashboard/dash-header/dash-header.component";

@Component({
  selector: 'app-dash-settings',
  standalone: true,
  imports: [DashHeaderComponent],
  templateUrl: './dash-settings.component.html',
  styleUrl: './dash-settings.component.css'
})
export class DashSettingsComponent {

}
