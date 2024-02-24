import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ModalService } from '@app/core/service/modal/modal.service';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [RouterLink, NgFor, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input() public navigationLinks: any = [];

    // constructor(private _modalService: ModalService) {}

    // public openLoginModal() {
    //     this._modalService.openLoginModal();
    //     // .subscribe((action)=> {
    //     //   console.log('Action:' action)
    //     // });
    // }
}
