class Message {
  /**
   * @param {string} to 
   * @param {string} from 
   * @param {string} body 
   */
  constructor(to, from , body) {
    this.to = to;
    this.from = from;
    this.body = body;
  }
}

module.exports = Message;