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
    time_passed: number,
}

export type SportDictionary = { [key: string]: ExerciseInterface[] };

