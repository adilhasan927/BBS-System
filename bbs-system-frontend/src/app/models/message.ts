export class Message {
  constructor(to: string, from: string, body: string) {
    this.to = to;
    this.from = from;
    this.body = body;
  }

  to: string;
  from: string;
  body: string;
}