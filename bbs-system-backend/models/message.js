class Message {
  /**
   * @param {number} timestamp
   * @param {string} from
   * @param {string} body
   * @param {string} filename
   */
  constructor(timestamp, from, body, filename) {
    this.timestamp = timestamp;
    this.from = from;
    this.body = body;
    this.filename = filename;
  }
}

module.exports = Message;
