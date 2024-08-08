import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Output,
    ViewChild,
    input,
} from '@angular/core';

@Component({
    selector: 'cv-connection-modal',
    standalone: true,
    imports: [],
    templateUrl: './connection-modal.component.html',
    styleUrl: './connection-modal.component.scss',
})
export class ConnectionModalComponent {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    public header = input.required<string>();
    @Output() public emittedModalHide = new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    public confirmModalDialog() {
        this.emittedModalHide.emit(false);
    }

    public onBackgroundClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains(this.modal.nativeElement.classList)) {
            this.closeModalDialog();
        }
    }

    public closeModalDialog() {
        this.emittedModalHide.emit(false);
    }

    public resetModalDialog() {
        this.emittedModalHide.emit(false);
    }
}
