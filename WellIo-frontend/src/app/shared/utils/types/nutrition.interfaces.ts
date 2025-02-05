import { UserInterface } from "./user.interfaces";

export interface MealInterface {
    id?: number,
    user?: UserInterface,
    date?: string,
    type: string,
    description?: string,
    dishes: DishInterface[],
}

export interface DishInterface {
    id?: number,
    meal?: MealInterface,
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

export type MealDictionary = { [key: string]: MealInterface };

// Flatten Dish Interface 
export interface FlattenDish {
    mealData?: string,
    kcal: number,
    unit: string,
    fibers: number, 
    quantity: number,
    carbs: number,
    fats: number,
    proteins: number,
    mealType: string,
    name: string,
    meal_id: number,
}