import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ConfirmDeleteModalComponent} from '../forms/confirm-delete-modal/confirm-delete-modal.component';
import {NgForOf} from '@angular/common';
import {Note, Tag} from '../../../utils/types/calendar.interface';
import {EventNoteService} from '../../../services/event-note.service';

@Component({
  selector: 'app-notes-grid',
  standalone: true,
  imports: [
    ConfirmDeleteModalComponent,
    NgForOf
  ],
  templateUrl: './notes-grid.component.html',
  styleUrl: './notes-grid.component.css'
})
export class NotesGridComponent {
  @Input() notes: Note[] = []
  @Input() tags: Tag[] = []
  @Input() selectedTagIds: number[] = []
  @Output() createNote = new EventEmitter<void>()
  @Output() editNote = new EventEmitter<Note>()
  @Output() deleteNote = new EventEmitter<Note>()

  isDeleteModalOpen = false;
  noteToDelete: Note | null = null;

  constructor(private eventNoteService: EventNoteService) {}

  get filteredNotes(): Note[] {
    if (this.selectedTagIds.length === 0) return this.notes
    return this.notes.filter((note) => note.tags.some((tagId) => this.selectedTagIds.includes(tagId)))
  }

  getTagColor(tagId: number): string {
    const tag = this.tags.find((t) => t.id === tagId)
    return tag ? tag.color + "40" : "#e2e8f040"
  }

  getTagName(tagId: number): string {
    const tag = this.tags.find((t) => t.id === tagId)
    return tag ? tag.name : ""
  }

  getNoteBgColor(note: Note): string {
    if (note.tags.length === 0) return "rgba(255, 255, 255, 0.1)"
    const tag = this.tags.find((t) => t.id === note.tags[0])
    return tag ? tag.color + "10" : "rgba(255, 255, 255, 0.1)"
  }

  onDeleteNote(note: Note): void {
    this.noteToDelete = note;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (this.noteToDelete) {
      this.eventNoteService.deleteNote(this.noteToDelete.id).subscribe({
        next: () => {
          this.deleteNote.emit(this.noteToDelete!);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting note:', error);
          // Qui potresti aggiungere una gestione degli errori, come mostrare una notifica
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.noteToDelete = null;
  }

  onNoteClick(note: Note): void {
    this.editNote.emit(note);
  }
}
