/**
 * ParsingException thrown when parsing fails.
 */
class ParsingException extends Error {
  /**
   * ParsingException constructor.
   * @param {string} message
   */
  constructor(message) {
    super();
    this.name = 'ParsingException';
    this.message = message;
  }
}

module.exports.ParsingException = ParsingException;