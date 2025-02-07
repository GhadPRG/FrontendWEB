import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSportComponent } from './dash-sport.component';

describe('DashSportComponent', () => {
  let component: DashSportComponent;
  let fixture: ComponentFixture<DashSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashSportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
