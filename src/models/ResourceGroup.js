/**
 * ResourceGroup class
 * @see https://apiblueprint.org/documentation/specification.html#def-resourcegroup-section
 */
class ResourceGroup {
  /**
   * ResourceGroup constructor.
   * @param {String}  name
   * @param {String}  slug
   * @param {String}  description
   */
  constructor(name, slug, description) {
    /**
     * @type {String}
     * @description Name of the resource group
     */
    this.name = name;

    /**
     * @type {String}
     * @description Parsed markdown description
     */
    this.description = description;

    /**
     * @type {String}
     * @description Slug used for anchor links
     */
    this.slug = slug;

    /**
     * @type {Array}
     * @description Array of resources
     */
    this.resources = [];
  }

  /**
   * Add a resource to the resource group.
   * @param {Resource} resource
   */
  addResource(resource) {
    this.resources.push(resource);
  }
}

module.exports = ResourceGroup;
