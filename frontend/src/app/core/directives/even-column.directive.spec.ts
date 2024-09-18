import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EvenColumnDirective } from './even-column.directive';

describe('EvenColumnDirective', () => {
    let elementRef: ElementRef;
    let renderer: Renderer2;

    beforeEach(() => {
        const element = document.createElement('div');
        elementRef = new ElementRef(element);

        TestBed.configureTestingModule({
            providers: [
                EvenColumnDirective,
                { provide: ElementRef, useValue: elementRef },
                Renderer2,
            ],
        });

        renderer = TestBed.inject(Renderer2);
    });

    it('should create an instance', () => {
        const directive = new EvenColumnDirective(elementRef, renderer);
        expect(directive).toBeTruthy();
    });

    it('should add "even-column" class to even columns', () => {
        const parentElement = document.createElement('div');
        parentElement.style.display = 'grid';
        parentElement.style.gridTemplateColumns = '1fr 1fr';

        const child1 = document.createElement('div');
        const child2 = document.createElement('div');
        const child3 = document.createElement('div');
        const child4 = document.createElement('div');

        parentElement.appendChild(child1);
        parentElement.appendChild(child2);
        parentElement.appendChild(child3);
        parentElement.appendChild(child4);

        elementRef.nativeElement = parentElement;

        const directive = new EvenColumnDirective(elementRef, renderer);
        directive.ngAfterViewInit();

        expect(child2.classList).toContain('even-column');
        expect(child4.classList).toContain('even-column');
    });
});
