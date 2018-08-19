class ParsingException extends Error {
  constructor(message) {
    super();
    this.name = 'ParsingException';
    this.message = message;
  }
}

module.exports.ParsingException = ParsingException;