import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarNotesComponent } from './calendar-notes.component';

describe('CalendarNotesComponent', () => {
  let component: CalendarNotesComponent;
  let fixture: ComponentFixture<CalendarNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
