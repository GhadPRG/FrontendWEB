import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DateTime} from 'luxon';
import {ClickOutsideDirective} from '../../directives/click-outside.directive';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    NgIf,
    ClickOutsideDirective,
    NgForOf
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = "Select date"
  @Output() dateSelected = new EventEmitter<DateTime>()

  isOpen = false
  currentMonth: DateTime = DateTime.now()
  selectedDate: DateTime | null = null
  daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"]
  calendarDays: DateTime[] = []
  disabled = false

  private onChange: any = () => {}
  private onTouched: any = () => {}

  constructor() {
    this.updateCalendarDays()
  }

  updateCalendarDays() {
    const start = this.currentMonth.startOf("month").startOf("week")
    const end = this.currentMonth.endOf("month").endOf("week")

    this.calendarDays = []
    let current = start

    while (current <= end) {
      this.calendarDays.push(current)
      current = current.plus({ days: 1 })
    }
  }

  prevMonth() {
    this.currentMonth = this.currentMonth.minus({ months: 1 })
    this.updateCalendarDays()
  }

  nextMonth() {
    this.currentMonth = this.currentMonth.plus({ months: 1 })
    this.updateCalendarDays()
  }

  isCurrentMonth(date: DateTime): boolean {
    return date.hasSame(this.currentMonth, "month")
  }

  isToday(date: DateTime): boolean {
    return date.hasSame(DateTime.now(), "day")
  }

  isSelected(date: DateTime): boolean {
    return this.selectedDate?.hasSame(date, "day") ?? false
  }

  selectDate(date: DateTime) {
    this.selectedDate = date
    this.onChange(date.toJSDate())
    this.dateSelected.emit(date)
  }

  togglePicker(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.onTouched()
    }
  }

  confirm(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.isOpen = false
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate)
    }
  }

  cancel(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.isOpen = false
  }

  writeValue(value: DateTime | null): void {
    this.selectedDate = value
    if (value) {
      this.currentMonth = value
      this.updateCalendarDays()
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onClickOutside(): void {
    this.isOpen = false
  }
}
