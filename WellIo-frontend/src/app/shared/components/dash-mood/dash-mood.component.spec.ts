import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashMoodComponent } from './dash-mood.component';

describe('DashMoodComponent', () => {
  let component: DashMoodComponent;
  let fixture: ComponentFixture<DashMoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashMoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashMoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
