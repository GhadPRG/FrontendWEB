import { Component, computed, OnInit, signal, Signal, WritableSignal } from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';
import { MoodService } from '../../services/mood.service';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateTime, Info, Interval } from 'luxon';
import { MoodDictionary, MoodFlatten, MoodInterface } from '../../utils/types/mood.interfaces';


@Component({
  selector: 'app-dash-mood',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dash-mood.component.html',
  styleUrl: './dash-mood.component.css'
})
export class DashMoodComponent implements OnInit {

  // Forms
  form_moodForm!: FormGroup;

  // Data for Mood Calendar
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
  activeDayMoods: Signal<MoodFlatten[]> = computed(() => {
    const activeDay = this.activeDay()
    if (activeDay === null) return [];

    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) return [];

    return this.moodDict[activeDayISO] ?? [];
  });

  // Data
  moodDict: MoodDictionary = {};
  // {
  //   '2025-02-05': [{moodLevel: 1, tags:[ { category: { name: 'Gatto' }, name: 'Miao'}, { category: { name: 'Gatt' }, name: 'Miao'}, { category: { name: 'Gatto' }, name: 'MiaoMiao'}], notes: ''}],
  //   '2025-02-04': [{moodLevel: 4, notes: 'Miao'}],
  //   '2025-02-03': [{moodLevel: 3, notes: 'Miao tanto Miao'}, {moodLevel: 2, notes: 'Miao Miao x 2'}, {moodLevel: 3, notes: 'Miao tantsso Miao'}, {moodLevel: 3, notes: 'Miao tsanto Miao'}, {moodLevel: 3, notes: 'Miao tanto Miao'}],
  //   '2025-02-07': [{moodLevel: 2, notes: ''}],
  // }
  currentMood: MoodInterface = this.getEmptyMoodBase();

  constructor(
      private dashService: DashboardService,
      public moodService: MoodService,
      private fb: FormBuilder
    ) 
    {
      this.initiateForms();
    }
  
    ngOnInit(): void {
      // Arriving on the Page
      this.dashService.setHeaderText("Mood Tracker");

      // console.log(this.daysOfMonth());
      // Requesting Mood
      this.moodService.getMoods().subscribe({
        next: (response) => {
          this.moodDict = this.moodService.mapMoodArrayToDictionary(response);
        }
      })
    }

    initiateForms(): void {
      this.form_moodForm = this.fb.group({
        mood_choice: new FormControl(''),
        note: new FormControl(''),
      });
    }

    onRegisterMood(): void {
      if(!this.form_moodForm.valid) return;

      this.currentMood = {
        moodLevel: this.moodService.moodTypes.indexOf(this.form_moodForm.get('mood_choice')?.value) + 1,
        moodDate: new Date().toISOString().split("T")[0],
        notes: this.form_moodForm.get('note')?.value,
        tags: [],
      };
      console.log(this.currentMood);

      this.moodService.registerNewMood(this.currentMood);
      
      if (!this.moodDict[this.currentMood.moodDate]) { this.moodDict[this.currentMood.moodDate] = []; }
      this.moodDict[this.currentMood.moodDate].push(this.currentMood as MoodFlatten);
      console.log('Dict', this.moodDict);

      setTimeout(() => {
        this.form_moodForm.reset();
      });
    }

    // Utility Funcions
    getEmptyMoodBase(): MoodInterface {
      return {
        moodLevel: 0,
        moodDate: '',
        notes: '',
        tags: [],
      };
    }

}
