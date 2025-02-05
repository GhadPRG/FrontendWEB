import { computed, inject, Injectable, signal } from '@angular/core';
import { ExerciseInterface } from '../utils/types/sport.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  // API Data & Urls
  private apiUrlSearchExercise = 'https://trackapi.nutritionix.com/v2/natural/exercise'; // Endpoint API
  private appId = 'ae6bbf02'; // App ID - Bruno Caruso
  private appKey = '11200806d60896b176ad76b08e53d83b'; // App Key - Bruno Caruso
  
  // Internal Url
  private serverUrl: string = "http://localhost:..."

  // Data
  readonly muscleGroups = ['Back','Chest', 'Shoudlers', 'Legs', 'Core', 'Arms'];

  exerciseWeeklyDonePerType = signal<Record<string, number>>(
    Object.fromEntries(this.muscleGroups.map(key => [key, 0])) as Record<string, number>
  );

  exerciseStatisticsWeeklyPerType = computed(() => {
    const exValues = this.exerciseWeeklyDonePerType();
    const total = Object.values(exValues).reduce((acc, val) => acc + val, 0);
  
    if (total === 0) return { upper_body: 0, lower_body: 0, core: 0, };
  
    return { 
      upper_body: ((exValues['Back'] + exValues['Shoudlers'] + exValues['Arms'])/ total) * 100, 
      lower_body: (exValues['Legs']/ total) * 100, 
      core: ((exValues['Core'] + exValues['Chest'])/ total) * 100, };
  });


  constructor(private http: HttpClient) {}



  getWeekExercise(): Observable<ExerciseInterface[]> {
    let temp = new BehaviorSubject<ExerciseInterface[]>([
      {
        exerciseInfo: {
          name: 'Esercizio 1',
          target_muscle_group: 'Back',
          met: 2
        },
        date: '2025-02-05',
        sets: 2,
        reps: 10,
        weight_used: 0,
        time_passed: 12
      },
      {
        exerciseInfo: {
          name: 'Esercizio 2',
          target_muscle_group: 'Back',
          met: 2
        },
        date: '2025-02-04',
        sets: 2,
        reps: 10,
        weight_used: 0,
        time_passed: 12
      },
      {
        exerciseInfo: {
          name: 'Esercizio 1 in Chest',
          target_muscle_group: 'Chest',
          met: 2
        },
        date: '2025-02-05',
        sets: 2,
        reps: 10,
        weight_used: 0,
        time_passed: 12
      },
      {
        exerciseInfo: {
          name: 'Esercizio 3',
          target_muscle_group: 'Chest',
          met: 2
        },
        date: '2025-02-04',
        sets: 2,
        reps: 10,
        weight_used: 0,
        time_passed: 12
      },
    ]);

    return temp;
    // return this.http.get<ExerciseInterface[]>(`${this.serverUrl}/`);
  }

  getExerciseInfo(exerciseName: string): Observable<any> {
    const headers = new HttpHeaders({
          'x-app-id': this.appId,
          'x-app-key': this.appKey
        });
    
    return this.http.post(`${this.apiUrlSearchExercise}?query=${exerciseName}`, {query: exerciseName }, { headers });
  }

  registerNewExercise(exercise: ExerciseInterface): void {//Observable<any> {
  // let request: Observable<any> = this.http.post(`${this.serverUrl}/`, exercise);

    // request.subscribe({
    //   next: (response) => {
    //     
    //   }
    // });
  
    // return request;
  }



  // Utility Funcitons
  mapExericesToExerciseDictionary(exercises: ExerciseInterface[]): { [key: string]: ExerciseInterface[] } {
    let dict: { [key: string]: ExerciseInterface[] } = exercises.reduce((acc, exercise) => {
      const key = exercise.exerciseInfo.target_muscle_group;

      if (!acc[key]) { acc[key] = []; }

      acc[key].push(exercise);
      return acc;

    }, {} as { [key: string]: ExerciseInterface[] });

    // Postwork to prepare Dictionary
    this.muscleGroups.forEach((currentGroup) => { if(!dict[currentGroup]) { dict[currentGroup] = [] }; });

    // Updating Statistics
    this.exerciseWeeklyDonePerType.set(
      Object.fromEntries(this.muscleGroups.map(key => [key, dict[key].length])) as Record<string, number>
    );

    return dict;
  }

  mapToTodayExerices(exerciseDict: { [key: string]: ExerciseInterface[] }): { [key: string]: ExerciseInterface[] } {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD" Format

    const filteredExercises: { [key: string]: ExerciseInterface[] } = {};

    for (const muscleGroup in exerciseDict) {
        const filteredList = exerciseDict[muscleGroup].filter(exercise => exercise.date === today );

        filteredExercises[muscleGroup] = (filteredList.length > 0) ? filteredList : [];
    }

    return filteredExercises;
  }
}
