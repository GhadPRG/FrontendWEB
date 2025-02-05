import { AfterViewInit, Component, ElementRef, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';
import { NutritionService } from '../../services/nutrition.service';
import { DishInterface, FlattenDish, MealInterface } from '../../utils/types/nutrition.interfaces';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-food',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dash-food.component.html',
  styleUrl: './dash-food.component.css'
})
export class DashFoodComponent implements OnInit, AfterViewInit {

  // Forms
  form_foodQuery!: FormGroup;
  form_dishForm!: FormGroup;


  // HTML Elements
  @ViewChildren('mealTypeBtn') mealTypeBtnsRef!: QueryList<ElementRef>;  // Meal's Dishes

  @ViewChild('foodResponseDisplayer') foodResponseDisplayerRef!: ElementRef; // Dish Registering
  @ViewChild('dishOptionsDisplayer') dishOptionsDisplayerRef!: ElementRef;
  @ViewChild('searchFoodInput') searchFoodInputRef!: ElementRef;


  // Data
  currentMeals: { [key: string]: MealInterface } = {};
  currentMealDishses = signal<string>('');


  currentDish: DishInterface = this.getEmptyBaseDish();
  gramsEquivalent: number = 0;


  // API Data and Info
  brandedFoodArray: any[] = [];
  commonFoodArray: any[] = [];

  constructor(
    private dashServive: DashboardService,
    public nutritionService: NutritionService,
    private fb: FormBuilder
  ) 
  {
    this.initiateForms();
  }

  ngOnInit(): void { 
    // Arriving on the Page
    this.dashServive.setHeaderText("Nutrition"); 

    // Requesting Macros if not set
    this.nutritionService.setMacroValues();
    this.nutritionService.getTodayMeals().subscribe({
      next: (response) => {
        this.currentMeals = this.nutritionService.mapMealsToMealsDict(
                            this.nutritionService.mealsUnflattener(response));
      }
    })

  }

  initiateForms(): void {
    this.form_foodQuery = this.fb.nonNullable.group({
      foodQuery: ['', Validators.required]
    });

    this.form_dishForm = this.fb.group({
      meal_choice: new FormControl(''),
      quantity: new FormControl(1)
    });
  }

  // Meals Related Code
  ngAfterViewInit(): void {

    this.mealTypeBtnsRef.forEach(btnRef => {
      btnRef.nativeElement.addEventListener('click', () => {
        this.requestDishesByType(btnRef.nativeElement.value);
      });
    });
  }

  requestDishesByType(mealType: string): void {
    // Removing Selection
    this.mealTypeBtnsRef.forEach(btnRef => {
      const btn = btnRef.nativeElement;

      this.currentMealDishses.set(mealType);

      if (btn.value !== mealType) { btn.classList.remove('selected'); }
      else { btn.classList.add('selected'); }
    });
  }

  selectCurrentMealAsMealDish(): void {
    this.form_dishForm.get('meal_choice')?.setValue(this.currentMealDishses());
  }


  // Dish Registration Related Code
  onSearchForFood(): void {
    const foodQuery = this.form_foodQuery.get('foodQuery')?.value;

    if (!foodQuery.trim()) return; 

    this.nutritionService.searchFood(foodQuery).subscribe({
      next: (response) => { 
        console.log('Risultati:', response);
        this.brandedFoodArray = response.branded;
        this.commonFoodArray = response.common; this.commonFoodArray.slice(0, 3);

        this.foodResponseDisplayerRef.nativeElement.classList.remove('closed');
        this.dishOptionsDisplayerRef.nativeElement.classList.add('closed');

      },
      error: (error) => { console.error('Errore API:', error) },
    });
  }

  getFoodInfo(foodName: string) {
    this.nutritionService.getFoodInfo(foodName).subscribe({
      next: (response) => { 
        
        // Settings for Current Dish
        this.currentDish = this.mapToDish(response, foodName);
        this.searchFoodInputRef.nativeElement.value = foodName;
        this.form_dishForm.value.quantity = 1;

        // Show COntext Menu
        this.foodResponseDisplayerRef.nativeElement.classList.add('closed');
        this.dishOptionsDisplayerRef.nativeElement.classList.remove('closed');

      },
      error: (error) => { console.error(`Errore API per ${foodName}:`, error) },
    });
  }

  onRegisterDish(): void {
    if(!this.form_dishForm.valid) return;

    const quantity = this.form_dishForm.getRawValue().quantity;
    if (quantity === 0) return; 

    // Setting Current Dish Attributes
    this.currentDish.meal = this.currentMeals[this.form_dishForm.getRawValue().meal_choice];
    this.currentDish.quantity = quantity;


    // this.nutritionService.registerNewDish(this.currentDish).subscribe({
    //   next: (response) => {
    //     let indexMeal = this.mealTypes.indexOf(this.currentDish.meal.type);

    //     this.currentMeals[indexMeal].dishes.push(this.currentDish);
    //   }
    // });

    
    console.log(this.currentDish);

    this.nutritionService.registerNewDish(this.currentDish);
    this.currentMeals[this.currentDish.meal.type].dishes.push(this.currentDish);

    // Resetting Values
    setTimeout(() => {
      this.form_dishForm.get('meal_choice')?.setValue('');
      this.form_dishForm.get('quantity')?.setValue(1);
      this.form_foodQuery.get('foodQuery')?.setValue('');
    });

  }

  // Utility Functions
  isLogoAPI(urlImage: string): boolean { return urlImage.endsWith('nix-apple-grey.png'); }

  getEmptyBaseDish(): DishInterface {
    return {
      meal: {} as MealInterface,
      dishInfo: {
        name: '',
        kcalories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        fibers: 0
      },
      quantity: 0,
      unit: 'g'
    };
  }

  get adjustedStatsForCurrentDish() {
    const quantity = this.form_dishForm.value.quantity || 1;

    return {
      kcalories: this.currentDish.dishInfo.kcalories * quantity,
      proteins: this.currentDish.dishInfo.proteins * quantity,
      fats: this.currentDish.dishInfo.fats * quantity,
      carbs: this.currentDish.dishInfo.carbs * quantity,
      fibers: this.currentDish.dishInfo.fibers * quantity,
    };
  }

  mapToDish(obj_NutritionixAPI: any, foodName: string): DishInterface {
    const obj = obj_NutritionixAPI;

    if (!obj || !obj.foods || obj.foods.lenght === 0) return {} as DishInterface;

    let totalCalories = 0;
    let totalProteins = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let totalFibers = 0;
    let totalGramsEquivalent = 0;

    // Sums All possible ingredients
    obj.foods.forEach((food: any) => {
      totalCalories += food.nf_calories || 0;
      totalProteins += food.nf_protein || 0;
      totalFats += food.nf_total_fat || 0;
      totalCarbs += food.nf_total_carbohydrate || 0;
      totalFibers += food.nf_dietary_fiber || 0;
      totalGramsEquivalent += food.serving_weight_grams || 0;
    });

    // Take the biggest Partial Quantity (Grams) as Unit Measure
    const maxQuantityFood = obj.foods.reduce((max: any, food: any) => 
      food.serving_weight_grams > max.serving_weight_grams ? food : max, obj.foods[0]
    );

    this.gramsEquivalent = totalGramsEquivalent;

    return {
          meal: {} as MealInterface,
          dishInfo: {
              id: 0,
              name: foodName,
              kcalories: totalCalories,
              proteins: totalProteins,
              fats: totalFats,
              carbs: totalCarbs,
              fibers: totalFibers,
            },
          quantity: 1,
          unit: maxQuantityFood.serving_unit + ` (${totalGramsEquivalent} g/piece)`,
    };
  }
}
