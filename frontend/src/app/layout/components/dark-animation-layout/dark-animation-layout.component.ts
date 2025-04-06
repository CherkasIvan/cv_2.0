import {
    Component,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
    input,
} from '@angular/core';

@Component({
    selector: 'cv-dark-animation-layout',
    standalone: true,
    templateUrl: './dark-animation-layout.component.html',
    styleUrls: ['./dark-animation-layout.component.scss'],
})
export class DarkAnimationLayoutComponent {
    @ViewChild('cursor') cursorRef!: ElementRef;
    public mouseX = input.required<number>();
    public mouseY = input.required<number>();

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.updateCursorPosition(event.pageX - 175, event.pageY - 175);
        this.showCursor();
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.hideCursor();
    }

    ngAfterViewInit() {
        this.updateCursorPosition(this.mouseX(), this.mouseY());
    }

    ngOnChanges() {
        this.updateCursorPosition(this.mouseX(), this.mouseY());
    }

    private updateCursorPosition(x: number, y: number) {
        if (this.cursorRef) {
            const cursorElement = this.cursorRef.nativeElement;
            cursorElement.style.left = `${x}px`;
            cursorElement.style.top = `${y}px`;
            cursorElement.style.opacity = '1';
        }
    }

    private showCursor() {
        if (this.cursorRef) {
            this.cursorRef.nativeElement.style.opacity = '1';
        }
    }

    private hideCursor() {
        if (this.cursorRef) {
            this.cursorRef.nativeElement.style.opacity = '0';
        }
    }
}
