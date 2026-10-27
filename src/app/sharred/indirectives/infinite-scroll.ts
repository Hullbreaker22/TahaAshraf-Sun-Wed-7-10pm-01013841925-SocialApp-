import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScroll implements AfterViewInit, OnDestroy {
  scrolled = output<void>();
  threshold = input<number>(400);   
  debug = input<boolean>(false);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private ticking = false;
  private destroyed = false;

  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      this.check();
    });
  };

  ngAfterViewInit() {
    document.addEventListener('scroll', this.onScroll, { capture: true, passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });

    requestAnimationFrame(() => this.check());
  }

  ngOnDestroy() {
    this.destroyed = true;
    document.removeEventListener('scroll', this.onScroll, { capture: true });
    window.removeEventListener('resize', this.onScroll);
  }

  private check() {
    if (this.destroyed) return;   

    const top = this.el.nativeElement.getBoundingClientRect().top;
    const distance = top - window.innerHeight;

    if (this.debug()) {
      console.log('[infinite-scroll] top:', Math.round(top), 'distance:', Math.round(distance), 'threshold:', this.threshold());
    }

    if (distance <= this.threshold()) {
      this.scrolled.emit();
    }
  }
}