import { TestBed } from '@angular/core/testing';

import { AnimateSsrService } from './animate-ssr.service';

describe('AnimateSsrService', () => {
    let service: AnimateSsrService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AnimateSsrService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
