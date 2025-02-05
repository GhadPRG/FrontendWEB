import { UserInterface } from "./user.interfaces";

export interface MealInterfarce {
    id?: number,
    user?: UserInterface,
    date?: string,
    type: string,
    description?: string,
    dishes: DishInterface[],
}

export interface DishInterface {
    id?: number,
    meal: MealInterfarce,
    dishInfo: DishInfoInterface,
    quantity: number,
    unit: string,
}

export interface DishInfoInterface {
    id?: number,
    name: string,
    kcalories: number,
    proteins: number,
    fats: number,
    carbs: number,
    fibers: number,
}

export interface MacrosInterface {
    kcalories: number,
    proteins: number,
    fats: number,
    carbs: number,
    fibers: number,
}