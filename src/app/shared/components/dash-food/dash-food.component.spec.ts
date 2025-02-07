import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFoodComponent } from './dash-food.component';

describe('DashFoodComponent', () => {
  let component: DashFoodComponent;
  let fixture: ComponentFixture<DashFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
