import { AfterViewInit, Component, ElementRef, OnInit, QueryList, signal, ViewChildren } from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';
import { SportService } from '../../services/sport.service';
import { ExerciseInterface, SportDictionary } from '../../utils/types/sport.interfaces';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dash-sport',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dash-sport.component.html',
  styleUrl: './dash-sport.component.css'
})
export class DashSportComponent implements OnInit, AfterViewInit {

  // Forms
  form_registerExercise!: FormGroup;

  // HTML Elements
  @ViewChildren('muscleGroupBtn') muscleGroupBtnsRef!: QueryList<ElementRef>;  // Muscle Groups

  // Data
  exerciseDict: SportDictionary = {};
  todayExerciseDict: SportDictionary = {};
  currentMuscleGroupShown = signal<string>('');

  constructor(
    private dashService: DashboardService,
    public sportService: SportService,
    private fb: FormBuilder
  )
  {
    this.initiateForms();
  }

  ngOnInit(): void {
    // Arriving on the Page
    this.dashService.setHeaderText("Sport & Exercise");

    // Setting up Sports Type
    this.exerciseDict = this.sportService.defineAllSportType(this.exerciseDict);
    this.todayExerciseDict = this.sportService.defineAllSportType(this.todayExerciseDict);

    // Request Exercise of This Week
    this.sportService.getWeekExercise().subscribe({
      next: (response) => {
        const unflattenResponse = this.sportService.unflattenExercises(response);
        const currentDate = new Date().toISOString().split("T")[0];
        unflattenResponse.forEach((ex) => ex.date = currentDate);

        this.exerciseDict = this.sportService.mapExericesToExerciseDictionary(unflattenResponse);
        this.todayExerciseDict = this.sportService.mapToTodayExerices(this.exerciseDict);
      }
    });
  }

  initiateForms(): void {
    this.form_registerExercise = this.fb.nonNullable.group({
      name: ['', Validators.required],
      muscleGroup_choice: new FormControl(''),
      sets: [0, Validators.required],
      reps: [0, Validators.required],
      weight_used: [0, Validators.required],
    });
  }

  // Meals Related Code
  ngAfterViewInit(): void {

    this.muscleGroupBtnsRef.forEach(btnRef => {
      btnRef.nativeElement.addEventListener('click', () => {
        this.requestMuscleGroupByType(btnRef.nativeElement.value);
      });
    });
  }

  requestMuscleGroupByType(type: string): void {
    // Removing Selection
    this.muscleGroupBtnsRef.forEach(btnRef => {
      const btn = btnRef.nativeElement;

      this.currentMuscleGroupShown.set(type);

      if (btn.value !== type) { btn.classList.remove('selected'); }
      else { btn.classList.add('selected'); }
    });
  }

  selectCurrentMuscleGroupToShow() {
    this.form_registerExercise.get('muscleGroup_choice')?.setValue(this.currentMuscleGroupShown());
  }


  onRegisterExercise(): void {
    if(!this.form_registerExercise.valid) return;

    const sets = this.form_registerExercise.get('sets')?.value;
    const reps = this.form_registerExercise.get('reps')?.value;

    if (sets == 0 || reps == 0 ) return;

    this.sportService.getExerciseInfo(this.form_registerExercise.get('name')?.value).subscribe({
      next: (response) => {

        let currentExercise: ExerciseInterface = {
          exerciseInfo: {
            name: response.name ?? this.form_registerExercise.get('name')?.value,
            target_muscle_group: this.form_registerExercise.get('muscleGroup_choice')?.value,
            met: (response.exercises.length > 0) ? response.exercises[0].met : 1, // Default Value
          },
          date: new Date().toISOString().split("T")[0],
          sets: this.form_registerExercise.get('sets')?.value,
          reps: this.form_registerExercise.get('reps')?.value,
          weight_used: this.form_registerExercise.get('weight_used')?.value,
        };

        this.sportService.registerNewExercise(currentExercise).subscribe(
          response => console.log('Success:', response),
          error => console.error('Error:', error)
        );

        // Local Update
        this.exerciseDict[currentExercise.exerciseInfo.target_muscle_group].push(currentExercise);
        this.todayExerciseDict[currentExercise.exerciseInfo.target_muscle_group].push(currentExercise);

        // Resetting Values
        setTimeout(() => {
          this.form_registerExercise.get('name')?.setValue('');
          this.form_registerExercise.get('muscleGroup_choice')?.setValue('');
          this.form_registerExercise.get('sets')?.setValue(0);
          this.form_registerExercise.get('reps')?.setValue(0);
          this.form_registerExercise.get('weight_used')?.setValue(0);
        });
      }
    });
  }

}
