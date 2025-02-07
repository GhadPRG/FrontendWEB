import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {ClickOutsideDirective} from '../../directives/click-outside.directive';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    NgIf,
    ClickOutsideDirective
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    }
  ]
})
export class TimePickerComponent implements ControlValueAccessor {
  @Input() label = "Time"
  @Input() placeholder = "Select time"
  @Output() timeChange = new EventEmitter<string>()

  hours = 0
  minutes = 0
  isOpen = false

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  writeValue(value: string): void {
    if (value) {
      const [hours, minutes] = value.split(":").map(Number)
      this.hours = hours
      this.minutes = minutes
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  togglePicker(event?: MouseEvent): void {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.onTouched()
    }
  }

  incrementHours(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.hours = (this.hours + 1) % 24
    this.updateTime()
  }

  decrementHours(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.hours = (this.hours - 1 + 24) % 24
    this.updateTime()
  }

  incrementMinutes(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.minutes = (this.minutes + 1) % 60
    this.updateTime()
  }

  decrementMinutes(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.minutes = (this.minutes - 1 + 60) % 60
    this.updateTime()
  }

  updateTime(): void {
    const time = this.formatTime()
    this.onChange(time)
    this.timeChange.emit(time)
  }

  formatTime(): string {
    return `${this.padZero(this.hours)}:${this.padZero(this.minutes)}`
  }

  padZero(num: number): string {
    return num.toString().padStart(2, "0")
  }

  confirm(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isOpen = false
  }

  cancel(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isOpen = false
  }

  onClickOutside(): void {
    this.isOpen = false
  }
}
