class Blueprint {
  constructor() {
    this.dataStructures = {};
    this.slugs = {};
    this.navItems = [];
  }

  setTitle(title) {
    this.title = title;
  }

  setDescription(description) {
    this.description = description;
  }

  setResourceGroups(resourceGroups) {
    this.resourceGroups = resourceGroups;
  }

  setContent(content) {
    this.content = content;
  }

  setHost(host) {
    this.host = host;
  }

  setFormat(format) {
    this.format = format;
  }

  addDataStructure(dataStructure) {
    this.dataStructures[dataStructure.meta.id] = dataStructure;
  }

  hasSlug(slug) {
    return this.slugs.hasOwnProperty(slug);
  }

  addSlug(slug) {
    this.slugs[slug] = true;
  }

  addNavItem(item) {
    this.navItems.push(item);
  }
}

module.exports = Blueprint;