import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { animationGuard } from './animation.guard';

describe('animationGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => animationGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
