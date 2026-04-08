export class UserResponse {
    constructor(
        public id: string,
        public username: string,
        public email: string,
        public createdAt: Date,
    ) { }
}