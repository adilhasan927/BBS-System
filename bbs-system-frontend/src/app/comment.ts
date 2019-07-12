export class Comment {
    constructor(username: string, body: string) {
        this.username = username;
        this.body = body;
    }

    _id: string;
    username: string;
    body: string;
}
