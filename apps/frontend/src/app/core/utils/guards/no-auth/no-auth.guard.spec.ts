import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NoAuthGuard } from './no-auth.guard';

describe('NoAuthGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => NoAuthGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
