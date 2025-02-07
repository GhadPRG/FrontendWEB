import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSideCalendarComponent } from './dash-side-calendar.component';

describe('DashSideCalendarComponent', () => {
  let component: DashSideCalendarComponent;
  let fixture: ComponentFixture<DashSideCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashSideCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashSideCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
