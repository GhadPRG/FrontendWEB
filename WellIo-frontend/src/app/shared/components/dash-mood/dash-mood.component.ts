import { Component, computed, OnInit, signal, Signal, WritableSignal } from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';
import { MoodService } from '../../services/mood.service';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateTime, Info, Interval } from 'luxon';
import { MoodDict, MoodFlatten } from '../../utils/types/mood.interfaces';


@Component({
  selector: 'app-dash-mood',
  standalone: true,
  imports: [],
  templateUrl: './dash-mood.component.html',
  styleUrl: './dash-mood.component.css'
})
export class DashMoodComponent implements OnInit {

  // Data
  today : Signal<DateTime> = signal(DateTime.local());
  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );
  weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth().startOf('week'),
      this.firstDayOfActiveMonth().endOf('month').endOf('week'),
    ).splitBy({ day: 1 }).map(d => {
      if (d.start === null) { throw new Error('Wrong dates'); }
      return d.start;
    });
  });
  DATE_MED = DateTime.DATE_MED;

  activeDay: WritableSignal<DateTime | null> = signal(null);
  activeDayMoods: Signal<MoodFlatten> = computed(() => {
    const activeDay = this.activeDay()
    if (activeDay === null) return {} as MoodFlatten;

    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) return {} as MoodFlatten;

    return this.moodDict[activeDayISO] ?? {} as MoodFlatten;
  });

  moodDict: MoodDict = {
    '2025-02-05': {moodLevel: 1, notes: ''},
    '2025-02-04': {moodLevel: 4, notes: 'Miao'},
    '2025-02-03': {moodLevel: 3, notes: 'Miao tanto Miao'},
    '2025-02-07': {moodLevel: 2, notes: ''},
  }

  constructor(
      private dashService: DashboardService,
      public moodService: MoodService,
      private fb: FormBuilder
    ) 
    {
    }
  
    ngOnInit(): void {
      // Arriving on the Page
      this.dashService.setHeaderText("Mood Tracker");

      // console.log(this.daysOfMonth());
    }

}
