import { JwtGlobalGuard } from './jwt-global.guard';

describe('JwtGlobalGuard', () => {
    it('should be defined', () => {
        expect(new JwtGlobalGuard()).toBeDefined();
    });
});
