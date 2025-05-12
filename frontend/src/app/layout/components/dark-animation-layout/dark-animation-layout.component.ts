import { NgClass } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    ViewChild,
    input,
} from '@angular/core';

@Component({
    selector: 'cv-dark-animation-layout',
    standalone: true,
    imports: [NgClass],
    templateUrl: './dark-animation-layout.component.html',
    styleUrls: [
        './styles/dark-animation-layout.component.scss',
        './styles/dark-animation-layout-dm.component.scss',
        './styles/dark-animation-layout-mobile.component.scss',
    ],
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

    public rowsBlock: any = {
        rows: new Array(12).fill({ length: Math.random() > 0.5 ? 20 : 18 }),
        evenHexagons: new Array(20),
        oddHexagons: new Array(18),
    };

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
