import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<MouseEvent>();

  constructor(private _elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickTarget = event.target as HTMLElement;
    if (!this._elementRef.nativeElement.contains(clickTarget)) {
      this.appClickOutside.emit(event);
    }
  }
}

