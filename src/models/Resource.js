class Resource {
  constructor(resource) {
    this.element = resource.element;
    this.name = resource.name;
    this.uri = resource.uriTemplate;
    this.model = resource.model;
    this.parameters = resource.parameters;
    this.actions = [];
    this.content = resource.content;
  }

  setSlug(slug) {
    this.slug = slug;
  }

  setDescription(description) {
    this.description = description;
  }

  addAction(action) {
    this.actions.push(action);
  }
}

module.exports = Resource;
