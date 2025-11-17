import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Output,
    ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-connection-modal',
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './connection-modal.component.html',
    styleUrls: ['./connection-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionModalComponent {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @Output() public emittedModalHide = new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    public onBackgroundClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains(this.modal.nativeElement.classList)) {
        }
    }

    sendDialogForm() {}

    closeDialogForm() {}
}
