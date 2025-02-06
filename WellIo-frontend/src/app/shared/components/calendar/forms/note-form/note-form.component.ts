import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Note, Tag} from '../../../../utils/types/calendar.interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventNoteService} from '../../../../services/event-note.service';
import {DateTime} from 'luxon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() note: Note | null = null
  @Input() tags: Tag[] = [] // Added input
  @Output() closeModal = new EventEmitter<void>()
  @Output() saveNote = new EventEmitter<Note>()

  noteForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private eventNoteService: EventNoteService,
  ) {
    this.noteForm = this.createForm()
  }

  ngOnInit() {
    // this.eventNoteService.tags$.subscribe((tags) => {
    //   this.tags = tags
    // })
  }

  ngOnChanges() {
    if (this.note) {
      this.noteForm.patchValue({
        title: this.note.title,
        content: this.note.content,
        tags: this.note.tags,
      })
    } else {
      this.noteForm.reset(this.createForm().value)
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ["", Validators.required],
      content: ["", Validators.required],
      tags: [[]],
    })
  }

  onSubmit() {
    if (this.noteForm.valid) {
      const formValue = this.noteForm.value
      const note: Note = {
        id: this.note?.id || 0,
        title: formValue.title,
        content: formValue.content,
        createdAt: this.note?.createdAt || DateTime.now(),
        tags: formValue.tags,
      }

      this.saveNote.emit(note)
      this.closeModal.emit()
    }
  }

  cancel() {
    this.closeModal.emit()
  }

  onTagChange(event: Event) {
    const target = event.target as HTMLInputElement
    const tagId = Number.parseInt(target.value, 10)
    const currentTags = this.noteForm.get("tags")?.value as number[]

    if (target.checked) {
      this.noteForm.patchValue({ tags: [...currentTags, tagId] })
    } else {
      this.noteForm.patchValue({ tags: currentTags.filter((id) => id !== tagId) })
    }
  }

  isTagSelected(tagId: number): boolean {
    const currentTags = this.note?.tags || (this.noteForm.get("tags")?.value as number[])
    return currentTags.includes(tagId)
  }
}
