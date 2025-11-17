import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'cv-dark-animation-layout',
    templateUrl: './dark-animation-layout.component.html',
    styleUrls: ['./dark-animation-layout.component.scss'],
})
export class DarkAnimationLayoutComponent {
    @ViewChild('cursor') cursorRef!: ElementRef;

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const x = event.pageX - 175;
        const y = event.pageY - 175;

        this.updateCursorPosition(x, y);
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.cursorRef) {
            this.cursorRef.nativeElement.style.opacity = '0';
        }
    }

    private updateCursorPosition(x: number, y: number) {
        if (this.cursorRef) {
            const cursorElement = this.cursorRef.nativeElement;
            cursorElement.style.left = `${x}px`;
            cursorElement.style.top = `${y}px`;
            cursorElement.style.opacity = '1';
        }
    }
}
