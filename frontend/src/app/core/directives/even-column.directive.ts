import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[cvEvenColumn]',
    standalone: true,
})
export class EvenColumnDirective implements AfterViewInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngAfterViewInit() {
        const parent = this.el.nativeElement.parentElement;
        const columns = Array.from(parent.children);
        const columnCount = getComputedStyle(parent)
            .getPropertyValue('grid-template-columns')
            .split(' ').length;

        columns.forEach((column, index) => {
            const columnIndex = index % columnCount;
            if ((columnIndex + 1) % 2 === 0) {
                this.renderer.addClass(column, 'even-column');
            }
        });
    }
}
