import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { animationsGuard } from './animations.guard';

const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => animationsGuard(...guardParameters));

beforeEach(() => {
    TestBed.configureTestingModule({});
});

it('should be created', () => {
    expect(executeGuard).toBeTruthy();
});
