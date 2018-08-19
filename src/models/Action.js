class Action {
  constructor(action) {
    this.name = action.name;
    this.method = action.method;
    this.parameters = [];
    this.attributes = action.attributes;
    this.content = action.content;
    this.examples = action.examples;
  }

  setSlug(slug) {
    this.slug = slug;
  }

  setDescription(description) {
    this.description = description;
  }

}

module.exports = Action;
