import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, max, Observable } from 'rxjs';
import { DishInterface, FlattenDish, MacrosInterface, MealDictionary, MealInterface } from '../utils/types/nutrition.interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  // API Data & Urls
  private apiUrlSearchFood = 'https://trackapi.nutritionix.com/v2/search/instant'; // Endpoint API
  private apiUrlGetFoodInfo = 'https://trackapi.nutritionix.com/v2/natural/nutrients'; // Endpoint API
  private appId = 'ae6bbf02'; // App ID - Bruno Caruso
  private appKey = '11200806d60896b176ad76b08e53d83b'; // App Key - Bruno Caruso

  // Internal Url
  private serverUrl: string = 'http://localhost:8080/api/meal';
  // Data
  readonly mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  dailyTarget = signal<MacrosInterface>({
    kcalories: 0, carbs: 0, fats: 0, proteins: 0, fibers: 0,
  });

  consumed = signal<MacrosInterface>({
    kcalories: 0, carbs: 0, fats: 0, proteins: 0, fibers: 0,
  });

  percentage = computed(() => {
    const dailyValue = this.dailyTarget();
    const consumedValue = this.consumed();

    return {
      kcalories: this.clamp(0, (consumedValue.kcalories / (dailyValue.kcalories === 0 ? 1 : dailyValue.kcalories)) * 100, 100),
      proteins: this.clamp(0, (consumedValue.proteins / (dailyValue.proteins === 0 ? 1 : dailyValue.proteins)) * 100, 100),
      fibers: this.clamp(0, (consumedValue.fibers / (dailyValue.fibers === 0 ? 1 : dailyValue.fibers)) * 100, 100),
      carbs: this.clamp(0, (consumedValue.carbs / (dailyValue.carbs === 0 ? 1 : dailyValue.carbs)) * 100, 100),
      fats: this.clamp(0, (consumedValue.fats / (dailyValue.fats === 0 ? 1 : dailyValue.fats)) * 100, 100),
    };
  });

  constructor(private http: HttpClient) {}


  // External Data Requests
  searchFood(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-app-id': this.appId,
      'x-app-key': this.appKey
    });

    return this.http.get<any>(`${this.apiUrlSearchFood}?query=${query}`, { headers });
  }

  getFoodInfo(query:string): Observable<any> {
    const headers = new HttpHeaders({
      'x-app-id': this.appId,
      'x-app-key': this.appKey
    });

    return this.http.post<any>(`${this.apiUrlGetFoodInfo}`, { query }, { headers });
  }

  getTodayMeals(): Observable<MealDictionary> {

    const tempToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTczODc2NzIzOCwiZXhwIjoxNzM4ODUzNjM4fQ.5bqjKZceZhBALsq-voAH8iFfOy-Tz7HfzJS3J1TENzY';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tempToken}`
    });
    
    let request = this.http.get<MealDictionary>(`${this.serverUrl}`, { headers });
    request.subscribe({
      next: (responce) => this.recalculateMacros(responce)
    });

    return request;

  //   let temp = new BehaviorSubject<MealDictionary>({
  //     'Breakfast': {
  //         dishes: [
  //             {
  //                 unit: 'grams',
  //                 quantity: 3,
  //                 dishInfo: {
  //                     kcalories: 1,
  //                     fats: 1,
  //                     carbs: 1,
  //                     name: 'Pasta Bella',
  //                     proteins: 1,
  //                     fibers: 1
  //                 }
  //             },
  //             {
  //                 unit: 'plates',
  //                 quantity: 2,
  //                 dishInfo: {
  //                     kcalories: 1,
  //                     fats: 1,
  //                     carbs: 1,
  //                     name: 'Pasta Bella',
  //                     proteins: 1,
  //                     fibers: 1
  //                 }
  //             },
  //             {
  //                 unit: 'units',
  //                 quantity: 2,
  //                 dishInfo: {
  //                     kcalories: 1,
  //                     fats: 1,
  //                     carbs: 1,
  //                     name: 'Pasta Bella',
  //                     proteins: 1,
  //                     fibers: 1
  //                 }
  //             }
  //         ],
  //         id: 4,
  //         type: 'Breakfast'
  //     },
  //     'Dinner': {
  //         dishes: [
  //             {
  //                 unit: 'plates',
  //                 quantity: 8,
  //                 dishInfo: {
  //                     kcalories: 1,
  //                     fats: 1,
  //                     carbs: 1,
  //                     name: 'Pasta Bella',
  //                     proteins: 1,
  //                     fibers: 1
  //                 }
  //             }
  //         ],
  //         id: 6,
  //         type: 'Dinner'
  //     },
  //     'Lunch': {
  //         dishes: [
  //             {
  //                 unit: 'plates',
  //                 quantity: 5,
  //                 dishInfo: {
  //                     kcalories: 400,
  //                     fats: 8,
  //                     carbs: 70,
  //                     name: 'Pasta al Pomodoro',
  //                     proteins: 10,
  //                     fibers: 5
  //                 }
  //             }
  //         ],
  //         id: 5,
  //         type: 'Lunch'
  //     }
  // });

  // this.recalculateMacros(temp.value);
  
  // return temp;
  }

  registerNewDish(dish: DishInterface): Observable<any> {
    let request: Observable<any> = this.http.post(`${this.serverUrl}/`, this.dishFlattener(dish));
    console.log(this.dishFlattener(dish));

    request.subscribe({
      next: (response) => {
        this.consumed.update(current => ({
          kcalories: current.kcalories + (dish.dishInfo.kcalories * dish.quantity),
          carbs: current.carbs + (dish.dishInfo.carbs * dish.quantity), 
          fats: current.fats + (dish.dishInfo.fats * dish.quantity), 
          proteins: current.proteins + (dish.dishInfo.proteins * dish.quantity), 
          fibers: current.fibers + (dish.dishInfo.fibers * dish.quantity),
        }));
      }
    });
  
    return request;
  }

  // Internal Calcutations 
  setMacroValues(): void {
    //const dailyKcals = inject(UserService).getCurrentUserInfo().daily_kcalories;
    const dailyKcals = 2000;

    const carbsDailyKcalFactor = 0.5; const carbsPowerFactor = 3.75;
    const fatsDailyKcalFactor = 0.25; const fatsPowerFactor = 9;
                                      const proteinPowerFactor = 4;

    let carbsKcal = dailyKcals * carbsDailyKcalFactor;
    let fatsKcal = dailyKcals * fatsDailyKcalFactor;
    let proteinsKcal = dailyKcals - carbsKcal - fatsKcal;

    let carbsGPerDay = carbsKcal / carbsPowerFactor;
    let fatsGPerDay = fatsKcal / fatsPowerFactor;
    let proteinsGPerDay = proteinsKcal / proteinPowerFactor;
    const fibersGPerDay = 26;

    this.dailyTarget.update(current => ({ 
      kcalories: dailyKcals, carbs: carbsGPerDay, fats: fatsGPerDay, proteins: proteinsGPerDay, fibers: fibersGPerDay 
    }));
  }

  recalculateMacros(mealDict: MealDictionary): void {
    const comsumedMacros: MacrosInterface = Object.values(mealDict).reduce<MacrosInterface>(
      (totals, meal) => {
        meal.dishes.forEach(dish => {
          totals.kcalories += dish.dishInfo.kcalories * dish.quantity;
          totals.fats += dish.dishInfo.fats * dish.quantity;
          totals.carbs += dish.dishInfo.carbs * dish.quantity;
          totals.proteins += dish.dishInfo.proteins * dish.quantity;
          totals.fibers += dish.dishInfo.fibers * dish.quantity;
        });
        return totals;
      },
      { kcalories: 0, fats: 0, carbs: 0, proteins: 0, fibers: 0 }
    );

    this.consumed.set(comsumedMacros);
  }

  // Utility functions
  clamp(min: number, value: number, max: number) { return Math.max(min, Math.min(value, max)); }

  mapMealsToMealsDict(meals: MealInterface[]): { [key: string]: MealInterface } {
    let dict: { [key: string]: MealInterface } = meals.reduce((acc, meal) => {
      const key = meal.type;

      if (!acc[key]) { acc[key] = {} as MealInterface; }

      acc[key] = meal;
      return acc;

    }, {} as { [key: string]: MealInterface });

    // Postwork to prepare Dictionary
    this.mealTypes.forEach((currentType) => { if(!dict[currentType]) { dict[currentType] = {} as MealInterface }; });

    return dict;
  }

  dishFlattener(dish: DishInterface): FlattenDish {
    let flatDish: FlattenDish = {
      kcal: (dish.dishInfo.kcalories * dish.quantity),
      unit: dish.unit,
      fibers: (dish.dishInfo.fibers * dish.quantity),
      quantity: dish.quantity,
      carbs: (dish.dishInfo.carbs * dish.quantity),
      fats: (dish.dishInfo.fats * dish.quantity),
      proteins: (dish.dishInfo.proteins * dish.quantity),
      name: dish.dishInfo.name,
      meal_id: (dish?.meal ?? { id: -1 }).id ?? -1,
      meal_type: (dish.meal ?? { type: ''}).type
    };

    return flatDish;
  }

  defineAllMealType(dict: MealDictionary): MealDictionary {
    this.mealTypes.forEach((currentType) => { 
      if(!dict[currentType]) {
        dict[currentType] = {
          type: currentType,
          dishes: []
        } 
      }; 
    });

    return dict;
  }


  // mealsUnflattener(dishes: FlattenDish[]): MealInterface[] {
  //   const mealsMap = new Map<string, MealInterface>();

  //   dishes.forEach(dish => {
  //     if (!dish.mealType) return; // To remove ?

  //     // Populating eals' Map
  //     if (!mealsMap.has(dish.mealType)) {
  //         mealsMap.set(dish.mealType, {
  //             id: dish.meal_id,
  //             type: dish.mealType,
  //             dishes: [],
  //         });
  //     }

  //     // Current Dish inside Meal
  //     const meal = mealsMap.get(dish.mealType)!;
  //     meal.dishes.push({
  //       unit: dish.unit,
  //       quantity: dish.quantity,
  //       meal: meal,
  //       dishInfo: {
  //         name: dish.name,
  //         kcalories: dish.kcal,
  //         proteins: dish.proteins,
  //         fats: dish.fats,
  //         carbs: dish.carbs,
  //         fibers: dish.fibers,
  //       }
  //     });
  //   });

  //   return Array.from(mealsMap.values());
  // }
}
