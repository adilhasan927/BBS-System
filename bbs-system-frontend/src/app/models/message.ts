export class Message {
  constructor(timestamp: number, from: string, body: string) {
    this.timestamp = timestamp;
    this.from = from;
    this.body = body;
  }

  timestamp: number;
  from: string;
  body: string;
}