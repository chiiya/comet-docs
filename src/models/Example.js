/**
 * Example class for example request / response
 * @see https://apiblueprint.org/documentation/specification.html#def-request-section
 */
class Example {
  /**
   * Example constructor
   * @param {Object}  example
   * @param {String}  example.name
   * @param {String}  example.description
   * @param {Array}   example.requests
   * @param {Array}   example.responses
   * @param {String}  description
   */
  constructor(example, description) {
    this.name = example.name || '';
    this.requests = [];
    this.responses = [];
    this.description = description;
  }

  /**
   * Add an example request.
   * @param {ExampleRequest} request
   */
  addRequest(request) {
    this.requests.push(request);
  }

  /**
   * Add an example response.
   * @param {ExampleResponse}  response
   */
  addResponse(response) {
    this.responses.push(response);
  }
}

module.exports = Example;
