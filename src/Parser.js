const path = require('path');
const drafter = require('drafter');
const util = require('util');
const markdown = require('markdown-it');
const hljs = require('highlight.js');
const slugify = require('slugify');
const File = require('./File');
const Blueprint = require('./models/Blueprint');
const ResourceGroup = require('./models/ResourceGroup');
const Resource = require('./models/Resource');
const Action = require('./models/Action');
const Exceptions = require('./Exceptions');

/**
 * Parser class
 * Responsible for parsing the input file, and further processing
 * the AST output from Protagonist
 */
class Parser {
  /**
   * Parser constructor
   * @param {File} file
   */
  constructor(file) {
    /**
     * @type {File}
     * @description Input file to be parsed
     */
    this.file = file;
  }

  /**
   * Parse the API Blueprint specified by the user.
   * @return {Promise<Blueprint>}
   */
  async execute() {
    try {
      Logger.spin('Parsing input file');
      const contents = await this.read();
      const blueprint = await this.parse(contents);
      Logger.succeed('Successfully parsed input file');
      return blueprint;
    } catch (err) {
      Logger.fail('Could not parse input file');
      throw new Exceptions.ParsingException(err.message);
    }
  }

  /**
   * Read the input file, by recursively replacing include statements with
   * the actual contents of the included partials.
   * @return {Promise<String>}
   */
  async read() {
    let contents = this.file.read();
    // Replace include statements with the contents of the included files
    // TODO: Allow recursive includes (includes in included files)
    contents = contents.replace(/( *)<!-- include\((.*)\) -->/gmi, (match, spaces, fileName) => {
      const fullPath = path.join(this.file.base(), fileName);
      const lines = File.find(fullPath).read().replace(/\r\n?/g, '\n').split('\n');
      return `${spaces}${lines.join(`\n${spaces}`)}`;
    });
    // Required to parse files on Windows
    contents = contents.replace(/\r\n?/g, '\n').replace(/\t/g, '    ');
    return contents;
  }

  /**
   * Parse the contents from the input file and construct our Blueprint.
   * @param {String} contents
   * @return {Promise<Blueprint>}
   */
  async parse(contents) {
    const parseBlueprint = util.promisify(drafter.parse);
    const result = await parseBlueprint(contents, { type: 'ast' });
    const blueprint = new Blueprint();
    const ast = result.ast;
    const md = this.getMarkdownInstance(blueprint);
    // Enable code highlighting for unfenced code blocks
    md.renderer.rules.code_block = md.renderer.rules.fence;

    // Parse blueprint attributes
    blueprint.setTitle(ast.name);
    blueprint.setDescription(md.render(ast.description));
    blueprint.setContent(ast.content);
    this.parseMetadata(blueprint, ast);
    this.parseDataStructures(blueprint, ast);
    this.parseResourceGroups(blueprint, ast, md);
    return blueprint;
  }

  /**
   * Parse host and format metadata from the AST.
   * @param {Blueprint} blueprint
   * @param {Object} ast
   */
  parseMetadata(blueprint, ast) {
    ast.metadata.forEach(metaDatum => {
      switch (metaDatum.name) {
        case 'HOST':
          blueprint.setHost(metaDatum.value);
          break;
        case 'FORMAT':
          blueprint.setFormat(metaDatum.value);
      }
    });
  }

  /**
   * Parse the data structures from the AST.
   * @param {Blueprint} blueprint
   * @param {Object} ast
   */
  parseDataStructures(blueprint, ast) {
    ast.content.forEach((category) => {
      category.content.forEach((item) => {
        if (item.element === 'dataStructure') {
          const dataStructure = item.content[0];
          blueprint.addDataStructure(dataStructure);
        }
      });
    });
  }

  /**
   * Parse the resource groups, their resources and actions from the AST.
   * @param {Blueprint} blueprint
   * @param {Object} ast
   * @param {Object} md
   */
  parseResourceGroups(blueprint, ast, md) {
    const resourceGroups = ast.resourceGroups || [];
    resourceGroups.forEach((resourceGroup) => {
      const parsedResourceGroup = this.parseResourceGroup(resourceGroup, blueprint, md);
      const resources = resourceGroup.resources || [];
      resources.forEach((resource) => {
        const parsedResource = this.parseResource(resource, parsedResourceGroup, blueprint, md);
        const actions = resource.actions || [];
        actions.forEach((action) => {
          const parsedAction = this.parseAction(action, parsedResource, parsedResourceGroup, blueprint, md);
          parsedResource.addAction(parsedAction);
        });
        parsedResourceGroup.addResource(parsedResource);
      });
      blueprint.addResourceGroup(parsedResourceGroup);
    });
  }

  /**
   * Parse a single resource group.
   * @param {Object}    resourceGroup
   * @param {Blueprint} blueprint
   * @param {Object}    md
   * @return {ResourceGroup}
   */
  parseResourceGroup(resourceGroup, blueprint, md) {
    const slug = this.getSlug(blueprint, resourceGroup.name);
    const description = md.render((resourceGroup.description || ''));
    return new ResourceGroup(resourceGroup.name, slug, description);
  }

  /**
   * Parse a single resource.
   * @param {Object}        resource
   * @param {ResourceGroup} resourceGroup
   * @param {Blueprint}     blueprint
   * @param {Object}        md
   * @return {Resource}
   */
  parseResource(resource, resourceGroup, blueprint, md) {
    const slug = this.getSlug(blueprint, `${resourceGroup.name}-${resource.name}`);
    const description = md.render((resource.description || ''));
    return new Resource(resource, slug, description);
  }

  /**
   * Parse a single action.
   * @param {Object}        action
   * @param {Resource}      resource
   * @param {ResourceGroup} resourceGroup
   * @param {Blueprint}     blueprint
   * @param {Object}        md
   * @return {Action}
   */
  parseAction(action, resource, resourceGroup, blueprint, md) {
    const slug = this.getSlug(blueprint, `${resourceGroup.name}-${resource.name}-${action.method}`);
    const description = md.render((action.description || ''));
    const a = new Action(action, slug, description);
    // Parameters can be defined on the action or parent resource, or both.
    if (a.uri === '') {
      if (action.parameters.length === 0) {
        a.parameters = resource.parameters;
      } else {
        a.parameters = action.parameters.concat(resource.parameters);
      }
    }
    // Filter out duplicates
    const usedParameters = {};
    a.parameters = a.parameters.filter((parameter) => {
      return usedParameters.hasOwnProperty(parameter.name) ? false : (usedParameters[parameter.name] = true);
    });

    return a;
  }

  /**
   * Get the markdown parser instance for a given blueprint.
   * @param {Blueprint} blueprint
   * @return {Object}
   */
  getMarkdownInstance(blueprint) {
    return markdown({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang === undefined || lang === null || lang === '') {
          return hljs.highlightAuto(str).value.trim();
        }
        if (lang === 'no-highlight') {
          return str.trim();
        }
        return hljs.highlight(lang, str, true).value.trim();
      },
    })
      .use(require('markdown-it-anchor'), {
        permalink: true,
        permalinkSymbol: '🔗',
        permalinkClass: 'permalink',
        slugify: (value) => {
          const slug = this.getSlug(blueprint, value);
          blueprint.addNavItem({
            value,
            slug
          });
        }
      })
      .use(require('markdown-it-checkbox'));
  }

  /**
   * Get a (unique) slug from a string. Used for anchor links.
   * @param {Blueprint} blueprint
   * @param {String}    value
   */
  getSlug(blueprint, value) {
    let slug = slugify(value);
    if (blueprint.hasSlug(slug)) {
      slug = this.incrementSlug(slug);
    }
    blueprint.addSlug(slug);
    return slug;
  }

  /**
   * Increment a counter appended to a slug to keep it unique.
   * @param {String} slug
   * @returns {String}
   */
  incrementSlug(slug) {
    if (/\d+$/.test(slug)) {
      return slug.replace(/\d+$/, (value) => Number(value) + 1);
    }
    return `${slug}-1`;
  }

}

module.exports = Parser;
