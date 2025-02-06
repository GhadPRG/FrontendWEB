import { Injectable } from '@angular/core';
import { MoodDictionary } from '../utils/types/mood.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  // Data
  readonly moodTypes = ['Dispear', 'Sad', 'Normal', 'Fine', 'Happy'];


  // Utility Functions
  getMoodType(moodLevel: number): string {
    if (moodLevel < 0 || moodLevel > 5) return 'Unknown';

    return this.moodTypes[Math.round(moodLevel)];
  }

  getAverageMood(moodDict: MoodDictionary, targetDate: string): number {
    const entries = moodDict[targetDate];

    if (!entries || entries.length === 0) { return -1;}

    const totalMood = entries.reduce((sum, entry) => sum + entry.moodLevel, 0);
    return totalMood / entries.length;
}

  
  constructor() { }
}
