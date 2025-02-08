import { Injectable } from '@angular/core';
import { MoodDictionary, MoodFlatten, MoodInterface } from '../utils/types/mood.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private token: string | null = localStorage.getItem("token") ? localStorage.getItem("token") : null
  private getHeaders(): HttpHeaders {
      let headers = new HttpHeaders()
      if (this.token) {
          headers = headers.set("Authorization", `Bearer ${this.token}`)
      }
      return headers
  }


  // Internal Url
  private serverUrl: string = 'http://localhost:8080/api/mood';
  // Data
  readonly moodTypes = ['Dispear', 'Sad', 'Normal', 'Fine', 'Happy'];
  private dailyKcals: number | undefined;

  constructor(private http: HttpClient) {}

  // Utility Functions
  getMoodType(moodLevel: number): string {
    if (moodLevel < 1 || moodLevel > 5) return 'Unknown';

    return this.moodTypes[Math.round(moodLevel) - 1];
  }

  getAverageMood(moodDict: MoodDictionary, targetDate: string): number {
    const entries = moodDict[targetDate];

    if (!entries || entries.length === 0) { return -1;}

    const totalMood = entries.reduce((sum, entry) => sum + entry.moodLevel, 0);
    return totalMood / entries.length;
}

  getTagsStringsByDate(moodDict: MoodDictionary, targetDate: string): string[] {

    const entries = moodDict[targetDate];
    if (!entries || entries.length === 0) { return []; }

    const tagSet = new Set<string>();

    entries.forEach(entry => {
        if (!entry.tags) return;

        entry.tags.forEach(tag => {
            tagSet.add(`${tag.category.name}: ${tag.name}`);
        });
    });

    return Array.from(tagSet);
  }

  getNotesByDate(moodDict: MoodDictionary, targetDate: string): string[] {

    const entries = moodDict[targetDate];
    if (!entries || entries.length === 0) { return []; }

    const notesSet = new Set<string>();

    entries.forEach(entry => {
        if (!entry.notes) return;

        notesSet.add(entry.notes);
    });

    return Array.from(notesSet);
  }

  getMoods(): Observable<MoodInterface[]>{
    let request = this.http.get<MoodInterface[]>(`${this.serverUrl}`, { headers: this.getHeaders() });

    request.subscribe((response) => console.log(response))

    return request;
  }

  registerNewMood(mood: MoodInterface): Observable<any> {
    let request = this.http.post(`${this.serverUrl}`, mood, { headers: this.getHeaders() });
    
    request.subscribe((response) => console.log(response));

    return request;
  }

  mapMoodArrayToDictionary(moods: MoodInterface[]): MoodDictionary {
    return moods.reduce((acc: MoodDictionary, mood: MoodInterface) => {
        const dateKey = mood.moodDate;

        const moodFlatten: MoodFlatten = {
            moodLevel: mood.moodLevel,
            notes: mood.notes,
            tags: mood.tags ? mood.tags : undefined
        };

        if (!acc[dateKey]) { acc[dateKey] = []; }

        acc[dateKey].push(moodFlatten);

        return acc;
    }, {} as MoodDictionary);
  }
}
