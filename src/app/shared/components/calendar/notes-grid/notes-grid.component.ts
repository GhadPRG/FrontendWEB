import {Component, OnInit} from '@angular/core';
import {ConfirmDeleteModalComponent} from '../forms/confirm-delete-modal/confirm-delete-modal.component';
import {NgForOf} from '@angular/common';
import {Note, Tag} from '../../../utils/types/calendar.interface';
import {EventNoteService} from '../../../services/event-note.service';
import {NoteFormComponent} from "../forms/note-form/note-form.component";

@Component({
  selector: 'app-notes-grid',
  standalone: true,
    imports: [
        ConfirmDeleteModalComponent,
        NgForOf,
        NoteFormComponent
    ],
  templateUrl: './notes-grid.component.html',
  styleUrl: './notes-grid.component.css'
})
export class NotesGridComponent implements OnInit {
  notes: Note[] = []
  tags: Tag[] = []
  selectedTagIds: number[] = []

  isNoteFormOpen = false
  selectedNote: Note | null = null
  isDeleteModalOpen = false;
  noteToDelete: Note | null = null;
  filteredNotes: Note[] = []

  constructor(private eventNoteService: EventNoteService) {}

  ngOnInit() {
    this.loadData()
  }

  loadData(): void {
    this.eventNoteService.notes$.subscribe((notes) => {
      this.notes = notes
      this.filteredNotes = this.getFilteredNotes();
    })

    this.eventNoteService.categories$.subscribe(() => {
      this.tags = this.eventNoteService.getAllTags()
      this.filteredNotes = this.getFilteredNotes();
    })

    this.eventNoteService.tagSelected$.subscribe((filteredTags) => {
      this.onFilterChange(filteredTags)
    })
  }

  onFilterChange(selectedTagIds: number[]) {
    this.selectedTagIds = selectedTagIds
    this.filteredNotes = this.getFilteredNotes();
  }

  getFilteredNotes(): Note[] {
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

  createNote(): void {
    this.openNoteForm();
  }

  onNoteClick(note: Note): void {
    this.openNoteForm(note)
  }

  openNoteForm(note?: Note) {
      this.selectedNote = note || null
      this.isNoteFormOpen = true
  }

  closeNoteForm() {
      this.isNoteFormOpen = false
      this.selectedNote = null
  }

}
