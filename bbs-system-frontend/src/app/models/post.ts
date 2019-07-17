export class Post {
    constructor(_id: string, username: string, body: string) {
        this._id = _id;
        this.username = username;
        this.body = body;
    }

    _id: string;
    username: string;
    body: string;
}
