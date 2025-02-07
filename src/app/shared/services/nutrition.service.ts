import { HttpClient, HttpHeaders } from '@angular/common/http';
import {computed, inject, Injectable, OnInit, signal} from '@angular/core';
import { Observable } from 'rxjs';
import { DishInterface, FlattenDish, MacrosInterface, MealDictionary, MealInterface } from '../utils/types/nutrition.interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService implements OnInit{

  // API Data & Urls
  private apiUrlSearchFood = 'https://trackapi.nutritionix.com/v2/search/instant'; // Endpoint API
  private apiUrlGetFoodInfo = 'https://trackapi.nutritionix.com/v2/natural/nutrients'; // Endpoint API
  private appId = 'ae6bbf02'; // App ID - Bruno Caruso
  private appKey = '11200806d60896b176ad76b08e53d83b'; // App Key - Bruno Caruso
  private baseUrl = "http://localhost:8080/api"
  private token: string | null = localStorage.getItem("token") ? localStorage.getItem("token") : null

  private dailyKcals: number | undefined;

  private getHeaders(): HttpHeaders {
      let headers = new HttpHeaders()
      if (this.token) {
          headers = headers.set("Authorization", `Bearer ${this.token}`)
      }
      return headers
  }

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
//const dailyKcals = inject(UserService).getUserInfo().dailyCalories;
  constructor(
    private http: HttpClient, 
    private userService: UserService
  ) 
  {}
    
  ngOnInit(): void {
      // Assegna il valore direttamente alla proprietà di classe
      this.dailyKcals = this.userService.getUserInfo().dailyCalories;
      console.log(this.dailyKcals); // Usa "this" per accedere alla proprietà di classe
  }

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

    let request = this.http.get<MealDictionary>(`${this.baseUrl}/meal`, { headers: this.getHeaders() });
    request.subscribe({
      next: (response) => this.recalculateMacros(response)
    });

    return request;
  }

  registerNewDish(dish: DishInterface): Observable<any> {
    let request: Observable<any> = this.http.post(`${this.baseUrl}/meal`, this.dishFlattener(dish),{ headers: this.getHeaders() });

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

    setMacroValues(): void {
        // Assicurati che dailyKcals sia definito
        if (this.dailyKcals === undefined) {
            console.error('Daily calories are not defined');
            return; // Esci dalla funzione se dailyKcals non è definito
        }

        // Costanti per i calcoli
        const carbsDailyKcalFactor = 0.5;
        const carbsPowerFactor = 3.75;
        const fatsDailyKcalFactor = 0.25;
        const fatsPowerFactor = 9;
        const proteinPowerFactor = 4;

        // Calcoli delle calorie per macronutrienti
        const carbsKcal = this.dailyKcals * carbsDailyKcalFactor;
        const fatsKcal = this.dailyKcals * fatsDailyKcalFactor;
        const proteinsKcal = this.dailyKcals - carbsKcal - fatsKcal;

        // Conversione delle calorie in grammi
        const carbsGPerDay = carbsKcal / carbsPowerFactor;
        const fatsGPerDay = fatsKcal / fatsPowerFactor;
        const proteinsGPerDay = proteinsKcal / proteinPowerFactor;

        // Fibre fisse
        const fibersGPerDay = 26;

        // Aggiorna il target giornaliero
        this.dailyTarget.update(current => ({
            kcalories: this.dailyKcals!, // Usa l'operatore "non-null assertion" (!)
            carbs: carbsGPerDay,
            fats: fatsGPerDay,
            proteins: proteinsGPerDay,
            fibers: fibersGPerDay
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
    dict = this.defineAllMealType(dict);

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
      }
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
