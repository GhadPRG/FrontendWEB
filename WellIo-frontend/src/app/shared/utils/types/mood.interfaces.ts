import { UserInterface } from "./user.interfaces";

export interface MoodInterface {
    id?: number,
    user?: UserInterface,
    moodLevel: number;
    moodDate: string;
    notes: string,
    tags?: string,
}

export interface TagInterface {
    id?: number,
    category: CategoryInterface,
    name: string,
    description?: string,
}

export interface CategoryInterface {
    id?: number,
    name: String,
    description?: string,
    color: string,
    tags: string,
}

export type MoodFlatten = { moodLevel: number, tags?: [string, string][], notes: string }

export type MoodDict = { [date: string]: MoodFlatten }