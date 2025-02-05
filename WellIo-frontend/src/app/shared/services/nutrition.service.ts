import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { max, Observable } from 'rxjs';
import { DishInterface, FlattenDish, MacrosInterface, MealInterface } from '../utils/types/nutrition.interfaces';
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
  private serverUrl: string = "http://localhost:8080/api/meal"

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

  getTodayMeals(): Observable<FlattenDish[]> {
    let token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTczODc2NzIzOCwiZXhwIjoxNzM4ODUzNjM4fQ.5bqjKZceZhBALsq-voAH8iFfOy-Tz7HfzJS3J1TENzY";
    let headers=new HttpHeaders();
    console.log("SONO QUA PAPPAPERO");
    headers = headers.set("Authorization", `Bearer ${token}`)
    return this.http.get<FlattenDish[]>(`${this.serverUrl}`,{headers:headers});
  }

  registerNewDish(dish: DishInterface): Observable<any> {
    let token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTczODc2NzIzOCwiZXhwIjoxNzM4ODUzNjM4fQ.5bqjKZceZhBALsq-voAH8iFfOy-Tz7HfzJS3J1TENzY";
    let headers=new HttpHeaders();
    console.log("SONO QUA PAPPAPERO");
    headers = headers.set("Authorization", `Bearer ${token}`)
    let request: Observable<any> = this.http.post(`${this.serverUrl}`, this.dishFlattener(dish),{headers:headers});

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
    this.mealTypes.forEach((currentType) => { if(!dict[currentType]) { dict[currentType] = {} as MealInterface }; })

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
      meal_id: dish.meal.id ?? -1,
      mealType: dish.meal.type
    };

    return flatDish;
  }

  mealsUnflattener(dishes: FlattenDish[]): MealInterface[] {
    const mealsMap = new Map<string, MealInterface>();

    dishes.forEach(dish => {
      if (!dish.mealType) return; // To remove ?

      // Populating eals' Map
      if (!mealsMap.has(dish.mealType)) {
          mealsMap.set(dish.mealType, {
              id: dish.meal_id,
              type: dish.mealType,
              dishes: [],
          });
      }

      // Current Dish inside Meal
      const meal = mealsMap.get(dish.mealType)!;
      meal.dishes.push({
        unit: dish.unit,
        quantity: dish.quantity,
        meal: meal,
        dishInfo: {
          name: dish.name,
          kcalories: dish.kcal,
          proteins: dish.proteins,
          fats: dish.fats,
          carbs: dish.carbs,
          fibers: dish.fibers,
        }
      });
    });

    return Array.from(mealsMap.values());
  }




}
