export class User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
    ) {}

    public greet(): string {
        return `Hello, ${this.name}!`;
    }
}
