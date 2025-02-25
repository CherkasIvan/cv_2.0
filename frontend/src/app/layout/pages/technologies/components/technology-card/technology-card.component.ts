import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    SimpleChanges,
    input,
    signal,
} from '@angular/core';

import { ITechnologies } from '@core/models/technologies.interface';
import { technologyCardFadeIn } from '@core/utils/animations/technology-card-fade-in.animation';

@Component({
    selector: 'cv-technology-card',
    standalone: true,
    imports: [NgClass],
    templateUrl: './technology-card.component.html',
    styleUrls: [
        './technology-card.component.scss',
        './technology-card-dm/technology-card-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologyCardComponent {
    public technologyItem = input.required<ITechnologies | null>();
    public theme = input<boolean | null>();

    // // Флаг для отслеживания загрузки изображения
    // public isImageLoaded = signal(false); // Используем сигнал

    // // Метод для обработки события загрузки изображения
    // public onImageLoad() {
    //     this.isImageLoaded.set(true); // Устанавливаем значение сигнала
    // }

    // ngOnChanges(changes: SimpleChanges): void {
    //     console.log(this.technologyItem());
    //     if (changes['technologyItem']) {
    //         console.log(this.isImageLoaded());
    //         this.isImageLoaded.set(false); // Сбрасываем флаг при изменении technologyItem
    //     }
    // }
}
