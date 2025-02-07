import {Component, OnInit} from '@angular/core';
import {NotesGridComponent} from "../../shared/components/calendar/notes-grid/notes-grid.component";
import {TagFilterComponent} from "../../shared/components/calendar/tag-filter/tag-filter.component";
import {CalendarNotesComponent} from '../../shared/components/calendar/calendar-notes/calendar-notes.component';
import {DashboardService} from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
    imports: [
        NotesGridComponent,
        TagFilterComponent,
        CalendarNotesComponent
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.setHeaderText("")
  }
}
