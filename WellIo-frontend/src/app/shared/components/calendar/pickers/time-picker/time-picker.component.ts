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
  @Input() label: string = 'Time';
  @Input() placeholder: string = 'Select time';
  @Output() timeChange = new EventEmitter<string>();

  hours: number = 0;
  minutes: number = 0;
  isOpen: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      this.hours = hours;
      this.minutes = minutes;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  togglePicker(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onTouched();
    }
  }

  incrementHours(): void {
    this.hours = (this.hours + 1) % 24;
    this.updateTime();
  }

  decrementHours(): void {
    this.hours = (this.hours - 1 + 24) % 24;
    this.updateTime();
  }

  incrementMinutes(): void {
    this.minutes = (this.minutes + 1) % 60;
    this.updateTime();
  }

  decrementMinutes(): void {
    this.minutes = (this.minutes - 1 + 60) % 60;
    this.updateTime();
  }

  updateTime(): void {
    const time = this.formatTime();
    this.onChange(time);
    this.timeChange.emit(time);
  }

  formatTime(): string {
    return `${this.padZero(this.hours)}:${this.padZero(this.minutes)}`;
  }

  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  confirm(): void {
    this.isOpen = false;
  }

  cancel(): void {
    this.isOpen = false;
  }

  onClickOutside(): void {
    this.isOpen = false;
  }
}
