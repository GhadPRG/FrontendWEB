import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {DatePickerComponent} from '../../pickers/date-picker/date-picker.component';
import {TimePickerComponent} from '../../pickers/time-picker/time-picker.component';
import {ConfirmDeleteModalComponent} from '../confirm-delete-modal/confirm-delete-modal.component';
import {CalendarEvent, Category, Tag} from '../../../../utils/types/calendar.interface';
import {EventNoteService} from '../../../../services/event-note.service';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    DatePickerComponent,
    TimePickerComponent,
    NgForOf,
    ConfirmDeleteModalComponent
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() event: CalendarEvent | null = null;
  @Input() categories: Category[] = [];
  @Input() tags: Tag[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<CalendarEvent>();
  @Output() deleteEvent = new EventEmitter<CalendarEvent>();

  eventForm: FormGroup;
  isDeleteModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private eventNoteService: EventNoteService,
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit() {
    // Initialization logic if needed
  }

  ngOnChanges() {
    if (this.event) {
      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        start: this.event.start,
        startTime: this.event.start.toFormat("HH:mm"),
        end: this.event.end,
        endTime: this.event.end?.toFormat("HH:mm"),
        categoryId: this.event.categoryId,
        tags: this.event.tags,
      });
    } else {
      this.eventForm.reset(this.createForm().value);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ["", Validators.required],
      description: [""],
      start: [DateTime.now(), Validators.required],
      startTime: ["09:00", Validators.required],
      end: [null],
      endTime: [null],
      categoryId: [null],
      tags: [[]],
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const event: CalendarEvent = {
        id: this.event?.id || 0,
        title: formValue.title,
        description: formValue.description,
        start: this.combineDateTime(formValue.start, formValue.startTime),
        end:
          formValue.end && formValue.endTime
            ? this.combineDateTime(formValue.end, formValue.endTime)
            : this.combineDateTime(formValue.start, formValue.startTime).plus({ hours: 1 }),
        categoryId: formValue.categoryId,
        tags: formValue.tags,
      };

      this.saveEvent.emit(event);
      this.closeModal.emit();
    }
  }

  private combineDateTime(date: DateTime, time: string): DateTime {
    const [hours, minutes] = time.split(":").map(Number);
    return date.set({ hour: hours, minute: minutes });
  }

  onTagChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const tagId = Number.parseInt(target.value, 10);
    const currentTags = this.eventForm.get("tags")?.value as number[];

    if (target.checked) {
      this.eventForm.patchValue({ tags: [...currentTags, tagId] });
    } else {
      this.eventForm.patchValue({ tags: currentTags.filter((id) => id !== tagId) });
    }
  }

  isTagSelected(tagId: number): boolean {
    const currentTags = this.event?.tags || (this.eventForm.get("tags")?.value as number[]);
    return currentTags.includes(tagId);
  }

  onDeleteEvent() {
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.event) {
      this.deleteEvent.emit(this.event);
      this.closeDeleteModal();
      this.closeModal.emit();
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
}
