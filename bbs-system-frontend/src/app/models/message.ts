export class Message {
  constructor(timestamp: number, from: string, body: string, filename: string) {
    this.timestamp = timestamp;
    this.from = from;
    this.body = body;
    this.filename = filename;
  }

  timestamp: number;
  from: string;
  body: string;
  filename: string;
  image: string;
}
