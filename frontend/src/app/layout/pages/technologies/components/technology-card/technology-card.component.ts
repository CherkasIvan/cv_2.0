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
    animations: [technologyCardFadeIn],
    templateUrl: './technology-card.component.html',
    styleUrls: [
        './technology-card.component.scss',
        './technology-card-dm/technology-card-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologyCardComponent implements OnChanges {
    public technologyItem = input.required<ITechnologies | null>();
    public theme = input<boolean | null>();
    public delay = input<string>();
    // Флаг для отслеживания загрузки изображения
    public isImageLoaded = signal(false);

    // Метод для обработки события загрузки изображения
    public onImageLoad() {
        this.isImageLoaded.set(true); // Устанавливаем значение сигнала
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['technologyItem']) {
            this.isImageLoaded.set(false); // Сбрасываем флаг при изменении technologyItem
        }
    }
}
