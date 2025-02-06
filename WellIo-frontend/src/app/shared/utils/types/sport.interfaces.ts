import { UserInterface } from "./user.interfaces";

export interface ExerciseInfoInterface {
    id?: number,
    name: string,
    target_muscle_group: string,
    met: number,
}


export interface ExerciseInterface {
    user?: UserInterface;
    exerciseInfo: ExerciseInfoInterface,
    date: string,
    sets: number,
    reps: number,
    weight_used: number,
}

export type SportDictionary = { [key: string]: ExerciseInterface[] };

export interface ExerciseFlatten {
    id?: number,
    notes?: string,
    name: string, 
    muscleGroup: string, 
    reps: number,
    sets: number,
    met: number,
    weight: number,
    date?: string,
}

