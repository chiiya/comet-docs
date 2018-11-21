const { Signale } = require('signale');
const ora = require('ora');

// Signale options
const options = {
  disabled: false,
  interactive: false,
  stream: process.stdout,
  scope: 'comet',
  types: {
    comet: {
      badge: '🌠',
      color: 'cyanBright',
      label: 'comet',
    },
  },
};

/**
 * Logger class
 * Used for custom console logging.
 */
class Logger {
  /**
   * Logger constructor
   */
  constructor() {
    this.console = new Signale(options);
    this.spinner = ora({ spinner: 'moon' });
  }

  /**
   * Log a console message using the comet style defined above.
   * @param {string} message
   */
  comet(message) {
    this.console.comet(message);
  }

  /**
   * Start spinning the spinner instance.
   * @param {string} message
   */
  spin(message) {
    this.spinner.text = message;
    if (this.spinner.isSpinning === false) {
      this.spinner.start();
    }
  }

  /**
   * Stop the spinner, set it to green, and persist it.
   * @param {string} message
   */
  succeed(message) {
    if (this.spinner.isSpinning === true) {
      this.spinner.succeed(message);
    }
  }

  /**
   * Stop the spinner, set it to red, and persist it.
   * @param {string} message
   */
  fail(message) {
    if (this.spinner.isSpinning === true) {
      this.spinner.fail(message);
    }
  }
}

module.exports = Logger;
