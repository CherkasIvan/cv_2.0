// libs/shared/src/class/User.ts
export class User {
    id;
    name;
    email;
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    greet() {
        return `Hello, ${this.name}!`;
    }
}
//# sourceMappingURL=User.js.map