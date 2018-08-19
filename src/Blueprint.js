class Blueprint {
  constructor() {
    this.dataStructures = {};
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
}

module.exports = Blueprint;