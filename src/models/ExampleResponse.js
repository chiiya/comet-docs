/**
 * Example response class
 * @see https://apiblueprint.org/documentation/specification.html#def-request-section
 */
class ExampleResponse {
  /**
   * Example constructor
   * @param {Object}  response
   * @param {String}  response.name
   * @param {String}  response.description
   * @param {Array}   response.headers
   * @param {String}  response.body
   * @param {String}  response.schema
   * @param {Array}   response.content
   * @param {String}  description
   */
  constructor(response, description) {
    this.name = response.name || '';
    this.headers = response.headers || [];
    this.body = response.body || '';
    this.schema = response.schema || '';
    this.description = description;
  }
}

module.exports = ExampleResponse;
