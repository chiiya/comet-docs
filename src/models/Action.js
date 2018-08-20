/**
 * Action class
 * @see https://apiblueprint.org/documentation/specification.html#def-action-section
 * TODO? We are not using the content or attributes.relation properties. Do we need them?
 */
class Action {
  /**
   * Action constructor
   * @param {Object}  action
   * @param {String}  action.name
   * @param {String}  action.description
   * @param {String}  action.method
   * @param {Array}   action.parameters
   * @param {Object}  action.attributes
   * @param {String}  action.attributes.relation
   * @param {String}  action.attributes.uriTemplate
   * @param {Array}   action.content
   * @param {Array}   action.examples
   * @param {String}  slug
   * @param {String}  description
   */
  constructor(action, slug, description) {
    /**
     * @type {String}
     * @description Name of the action
     */
    this.name = action.name || '';

    /**
     * @type {String}
     * @description Method name of the action (GET/POST/...)
     */
    this.method = action.method || '';

    /**
     * @type {String}
     * @description URI template string
     */
    this.uri = action.attributes.uriTemplate || '';

    /**
     * @type {String}
     * @description Slug used for anchor links
     */
    this.slug = slug;

    /**
     * @type {String}
     * @description Parsed markdown description
     */
    this.description = description;

    /**
     * @type {Array}
     * @description Array of parameters
     */
    this.parameters = [];

    /**
     * @type {Array}
     * @description Array of examples
     */
    this.examples = [];
  }

  /**
   * Add an example to the action examples.
   * @param {Example} example
   */
  addExample(example) {
    this.examples.push(example);
  }
}

module.exports = Action;
