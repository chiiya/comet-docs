/**
 * Example request class
 * @see https://apiblueprint.org/documentation/specification.html#def-request-section
 */
class ExampleRequest {
  /**
   * Example constructor
   * @param {Object}  request
   * @param {String}  request.name
   * @param {String}  request.description
   * @param {Array}   request.headers
   * @param {String}  request.body
   * @param {String}  request.schema
   * @param {Array}   request.content
   * @param {String}  description
   */
  constructor(request, description) {
    this.name = request.name || '';
    this.headers = request.headers || [];
    this.body = request.body || '';
    this.schema = request.schema || '';
    this.description = description;
  }
}

module.exports = ExampleRequest;
