import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category, Tag} from '../../../../utils/types/calendar.interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventNoteService} from '../../../../services/event-note.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './tag-form.component.html',
  styleUrl: './tag-form.component.css'
})
export class TagFormComponent implements OnInit {
  @Input() isOpen = false;
  @Input() tag: Tag | null = null;
  @Input() categories: Category[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTag = new EventEmitter<Tag>();

  tagForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventNoteService: EventNoteService,
  ) {
    this.tagForm = this.createForm();
  }

  ngOnInit() {
    if (this.tag) {
      this.tagForm.patchValue(this.tag);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      categoryId: [null, Validators.required],
      description: [""],
      color: ["#000000", [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
    });
  }

  onSubmit() {
    if (this.tagForm.valid) {
      const formValue = this.tagForm.value;
      const tag: Tag = {
        id: this.tag?.id || 0,
        ...formValue,
      };

      this.saveTag.emit(tag);
      this.closeModal.emit();
    }
  }

  cancel() {
    this.closeModal.emit();
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.tagForm.patchValue({ color });
  }

  onColorInputChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      this.tagForm.patchValue({ color });
    }
  }
}
