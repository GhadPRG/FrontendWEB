import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import type { Category, Tag } from "../../../utils/types/calendar.interface"
import { KeyValuePipe, NgForOf, NgIf } from "@angular/common"

@Component({
  selector: "app-tag-filter",
  standalone: true,
  imports: [NgIf, NgForOf, KeyValuePipe],
  templateUrl: "./tag-filter.component.html",
  styleUrl: "./tag-filter.component.css",
})
export class TagFilterComponent implements OnInit {
  @Input() tags: Tag[] = []
  @Input() categories: Category[] = []
  @Input() selectedTagIds: number[] = []
  @Output() filterChange = new EventEmitter<number[]>()

  tagsByCategory: { [key: number]: Tag[] } = {}

  ngOnInit() {
    this.groupTagsByCategory()
  }

  toggleTag(tagId: number) {
    const index = this.selectedTagIds.indexOf(tagId)
    if (index === -1) {
      this.selectedTagIds.push(tagId)
    } else {
      this.selectedTagIds.splice(index, 1)
    }
    this.filterChange.emit(this.selectedTagIds)
  }

  clearAll() {
    this.selectedTagIds = []
    this.filterChange.emit(this.selectedTagIds)
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTagIds.includes(tagId)
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId)
    return category ? category.name : "Non categorizzato"
  }

  getTagBackgroundColor(tag: Tag): string {
    if (this.isTagSelected(tag.id)) {
      return tag.color
    }
    const rgb = this.hexToRgb(tag.color)
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
  }

  getTagTextColor(tag: Tag): string {
    return this.isTagSelected(tag.id) ? "#ffffff" : "inherit"
  }

  getTagBorder(tag: Tag): string {
    return this.isTagSelected(tag.id) ? "none" : `1px solid ${tag.color}`
  }

  private groupTagsByCategory() {
    this.tagsByCategory = this.categories.reduce(
      (acc, category) => {
        acc[category.id] = category.tags || []
        return acc
      },
      {} as { [key: number]: Tag[] },
    )
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 }
  }
}

