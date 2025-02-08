import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { NgForOf, NgIf } from "@angular/common"
import { DatePickerComponent } from "../../pickers/date-picker/date-picker.component"
import { TimePickerComponent } from "../../pickers/time-picker/time-picker.component"
import { ConfirmDeleteModalComponent } from "../confirm-delete-modal/confirm-delete-modal.component"
import type { CalendarEvent, Tag } from "../../../../utils/types/calendar.interface"
import { EventNoteService } from "../../../../services/event-note.service"
import { DateTime } from "luxon"

@Component({
  selector: "app-event-form",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, DatePickerComponent, TimePickerComponent, NgForOf, ConfirmDeleteModalComponent],
  templateUrl: "./event-form.component.html",
  styleUrl: "./event-form.component.css",
})
export class EventFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() event: CalendarEvent | null = null
  @Output() closeModal = new EventEmitter<void>()

  tags: Tag[] = []
  eventForm: FormGroup
  isDeleteModalOpen = false

  constructor(
    private fb: FormBuilder,
    private eventNoteService: EventNoteService,
  ) {
    this.eventForm = this.createForm()
  }

  ngOnInit() {
    if (this.tags.length === 0) {
      this.eventNoteService.categories$.subscribe(() => {
        this.tags = this.eventNoteService.getAllTags()
      })
    }
  }

  ngOnChanges() {
    if (this.event) {
      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        start: this.event.start,
        startTime: this.event.start.toFormat("HH:mm"),
        end: this.event.end || this.event.start.plus({ hours: 1 }),
        endTime: (this.event.end || this.event.start.plus({ hours: 1 })).toFormat("HH:mm"),
        tags: this.event.tags,
      })
    } else {
      const now = DateTime.now()
      const oneHourLater = now.plus({ hours: 1 })
      this.eventForm.patchValue({
        start: now,
        startTime: now.toFormat("HH:mm"),
        end: oneHourLater,
        endTime: oneHourLater.toFormat("HH:mm"),
      })
    }
  }

  createForm(): FormGroup {
    const now = DateTime.now()
    const oneHourLater = now.plus({ hours: 1 })
    return this.fb.group({
      title: ["", Validators.required],
      description: [""],
      start: [now, Validators.required],
      startTime: [now.toFormat("HH:mm"), Validators.required],
      end: [oneHourLater],
      endTime: [oneHourLater.toFormat("HH:mm")],
      tags: [[]],
    })
  }

  onSubmit(event: Event) {
    event.preventDefault()
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value
      try {
        const event: CalendarEvent = {
          id: this.event?.id || 0,
          title: formValue.title,
          description: formValue.description,
          start: this.combineDateTime(formValue.start, formValue.startTime),
          end: this.combineDateTime(formValue.end, formValue.endTime),
          tags: formValue.tags,
        }
        this.saveEvent(event)
        this.closeModal.emit()
      } catch (error) {
        console.error("Error creating event:", error)
      }
    }
  }

  saveEvent(event: CalendarEvent) {
    if (event.id) {
      this.eventNoteService.updateEvent(event).subscribe({
        next: () => {
        },
        error: (error) => {
          //console.error('Error updating event:', error);
        }
      });
    } else {
      this.eventNoteService.addEvent(event).subscribe({
        next: () => {
        },
        error: (error) => {
          //console.error('Error adding event:', error);
        }
      });
    }
  }

  private combineDateTime(date: DateTime, time: string): DateTime {
    if (!date || !time) return DateTime.now()
    try {
      const [hours, minutes] = time.split(":").map(Number)
      return date.set({
        hour: hours || 0,
        minute: minutes || 0,
        second: 0,
        millisecond: 0,
      })
    } catch (error) {
      console.error("Error combining date and time:", error)
      return DateTime.now()
    }
  }

  onDateChange(field: string, date: DateTime) {
    this.eventForm.patchValue({ [field]: date })
  }

  onTimeChange(field: string, time: string) {
    this.eventForm.patchValue({ [field]: time })
  }

  onTagChange(event: Event) {
    const target = event.target as HTMLInputElement
    const tagId = Number.parseInt(target.value, 10)
    const currentTags = this.eventForm.get("tags")?.value as number[]

    if (target.checked) {
      this.eventForm.patchValue({ tags: [...currentTags, tagId] })
    } else {
      this.eventForm.patchValue({ tags: currentTags.filter((id) => id !== tagId) })
    }
  }

  isTagSelected(tagId: number): boolean {
    const currentTags = this.event?.tags || (this.eventForm.get("tags")?.value as number[])
    return currentTags.includes(tagId)
  }

  onDeleteEvent() {
    this.isDeleteModalOpen = true
  }

  deleteEvent(event: CalendarEvent) {
    this.eventNoteService.deleteEvent(event.id).subscribe({
      next: () => {
      },
      error: (error) => {
        // console.error('Error deleting event:', error);
      }
    });
  }

  confirmDelete() {
    if (this.event) {
      this.deleteEvent(this.event)
      this.closeDeleteModal()
      this.closeModal.emit()
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false
  }
}

