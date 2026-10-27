import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-post-image',
  standalone: true,
  templateUrl: './post-image.component.html',
    host: { class: 'block' },
})
export class PostImageComponent {
  src = input.required<string>();
  alt = input<string>('Post image');
  imgClass = input<string>('');

  dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  open() {
    this.dlg().nativeElement.showModal();
  }

  close() {
    this.dlg().nativeElement.close();
  }

  onBackdropClick(e: MouseEvent) {
    if (e.target === this.dlg().nativeElement) this.close();
  }
}