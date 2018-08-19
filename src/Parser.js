const path = require('path');
const drafter = require('drafter');
const util = require('util');
const markdown = require('markdown-it');
const hljs = require('highlight.js');
const slugify = require('slugify');
const File = require('./File');
const Blueprint = require('./Blueprint');
const Exceptions = require('./Exceptions');

class Parser {
  /**
   *
   * @param {File} file
   */
  constructor(file) {
    this.file = file;
  }

  /**
   * Parse the API Blueprint specified by the user.
   *
   * @returns {Promise<Blueprint>}
   */
  async execute() {
    try {
      Logger.spin('Parsing input file');
      await this.read();
      const blueprint = await this.parse();
      Logger.succeed('Successfully parsed input file');
      return blueprint;
    } catch (err) {
      Logger.fail('Could not parse input file');
      throw new Exceptions.ParsingException(err.message);
    }
  }

  async read() {
    this.contents = this.file.read();
    // Replace include statements with the contents of the included files
    // TODO: Allow recursive includes (includes in included files)
    this.contents = this.contents.replace(/( *)<!-- include\((.*)\) -->/gmi, (match, spaces, fileName) => {
      const fullPath = path.join(this.file.base(), fileName);
      const lines = File.find(fullPath).read().replace(/\r\n?/g, '\n').split('\n');
      return `${spaces}${lines.join(`\n${spaces}`)}`;
    });
    // Required to parse files on Windows
    this.contents = this.contents.replace(/\r\n?/g, '\n').replace(/\t/g, '    ');
  }

  async parse() {
    const parseBlueprint = util.promisify(drafter.parse);
    const result = await parseBlueprint(this.contents, { type: 'ast' });
    const blueprint = new Blueprint();
    const ast = result.ast;
    const md = markdown({
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
          let slug = slugify(value);
          if (blueprint.hasSlug(slug)) {
            slug = this.incrementSlug(slug);
          }
          blueprint.addSlug(slug);
          blueprint.addNavItem({
            value,
            slug
          });
        }
      })
      .use(require('markdown-it-checkbox'));

    // Enable code highlighting for unfenced code blocks
    md.renderer.rules.code_block = md.renderer.rules.fence;

    blueprint.setTitle(ast.name);
    blueprint.setDescription(md.render(ast.description));
    blueprint.setResourceGroups(ast.resourceGroups);
    blueprint.setContent(ast.content);
    this.parseMetadata(blueprint, ast);
    this.parseDataStructures(blueprint, ast);
    return blueprint;
  }

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

  incrementSlug(slug) {
    if (slug.test(/\d+$/)) {
      return slug.replace(/\d+$/, (value) => Number(value) + 1);
    }
    return `${slug}-1`;
  }


}

module.exports = Parser;