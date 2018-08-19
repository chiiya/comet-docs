class ResourceGroup {
  constructor(resourceGroup) {
    this.name = resourceGroup.name;
    this.resources = [];
  }

  setDescription(description) {
    this.description = description;
  }

  setSlug(slug) {
    this.slug = slug;
  }

  addResource(resource) {
    this.resources.push(resource);
  }
}

module.exports = ResourceGroup;
