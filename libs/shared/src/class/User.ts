// libs/shared/src/class/User.ts
export class User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
    ) {}

    greet(): string {
        return `Hello, ${this.name}!`;
    }
}
