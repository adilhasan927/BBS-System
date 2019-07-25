class Message {
  /**
   * @param {number} timestamp
   * @param {string} from
   * @param {string} body
   */
  constructor(timestamp, from, body) {
    this.timestamp = timestamp;
    this.from = from;
    this.body = body;
  }
}

module.exports = Message;