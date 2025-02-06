import { Injectable } from '@angular/core';
import { MoodDictionary, TagInterface } from '../utils/types/mood.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  // Data
  readonly moodTypes = ['Dispear', 'Sad', 'Normal', 'Fine', 'Happy'];

  
  constructor() { }

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
}
