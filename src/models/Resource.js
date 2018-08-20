/**
 * Resource class
 * @see https://apiblueprint.org/documentation/specification.html#def-resource-section
 * TODO? We are not ignoring the model and content properties. Do we need them?
 */
class Resource {
  /**
   * Resource constructor
   * @param {Object}  resource
   * @param {String}  resource.element
   * @param {String}  resource.name
   * @param {String}  resource.uriTemplate
   * @param {Object}  resource.model
   * @param {Array}   resource.parameters
   * @param {Array}   resource.actions
   * @param {Array}   resource.content
   * @param {String}  slug
   * @param {String}  description
   */
  constructor(resource, slug, description) {
    /**
     * @type {String}
     * @description Name of the resource
     */
    this.name = resource.name || '';

    /**
     * @type {String}
     * @description URI template representing the endpoint of the resource
     */
    this.uri = resource.uriTemplate || '';

    /**
     * @type {Array}
     * @description Array of resource (uri) parameters
     */
    this.parameters = resource.parameters || [];

    /**
     * @type {String}
     * @description Slug used for anchor links
     */
    this.slug = slug;

    /**
     * @type {String}
     * @description Parsed markdown description of the resource
     */
    this.description = description;

    /**
     * @type {Array}
     * @description Array of resource actions
     */
    this.actions = [];
  }

  /**
   * Add an action to the resource.
   * @param {Action} action
   */
  addAction(action) {
    this.actions.push(action);
  }
}

module.exports = Resource;
