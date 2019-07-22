export class Post {
    constructor(_id: string, listingId: string, username: string, body: string) {
        this._id = _id;
        this.listingId = listingId;
        this.username = username;
        this.body = body;
    }

    _id: string;
    listingId: string;
    username: string;
    body: string;
}
