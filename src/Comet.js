const Parser = require('./Parser');
const Renderer = require('./Renderer');
const File = require('./File');

class Comet {
  /**
   * Comet constructor
   * @param {Object} argv
   * @param {string} argv.i - Path of the API Blueprint file
   */
  constructor(argv)  {
    this.options = {
      file: new File(argv.i),
      directory: process.cwd(),
    };
    this.parser = new Parser(this.options.file);
  }

  /**
   *
   *
   * @returns {Promise<Blueprint>}
   */
  async execute() {
    try {
      const blueprint = await this.parser.execute();
      const renderer = new Renderer(blueprint);
      return blueprint;
    } catch (err) {
      console.error(err.stack);
      process.exit(-1);
    }
  }

}

module.exports = Comet;