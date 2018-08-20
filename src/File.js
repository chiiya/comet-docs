let os = require('os');
let path = require('path');
let fs = require('fs-extra');

/**
 * Inspired by Laravel Mix
 * @see https://github.com/JeffreyWay/laravel-mix
 */
class File {
  /**
   * Create a new instance.
   *
   * @param {string} filePath
   */
  constructor(filePath) {
    this.absolutePath = path.resolve(filePath);
    this.filePath = this.relativePath();
    this.segments = this.parse();
  }

  /**
   * Static constructor.
   * @param {string} file
   * @return {File} New File instance
   */
  static find(file) {
    return new File(file);
  }

  /**
   * Get the size of the file.
   * @return {number}
   */
  size() {
    return fs.statSync(this.path()).size;
  }

  /**
   * Determine if the given file exists.
   * @param {string} file
   * @return {boolean}
   */
  static exists(file) {
    return fs.existsSync(file);
  }

  /**
   * Delete/Unlink the current file.
   */
  delete() {
    if (fs.existsSync(this.path())) {
      fs.unlinkSync(this.path());
    }
  }

  /**
   * Get the name of the file.
   * @return {string}
   */
  name() {
    return this.segments.file;
  }

  /**
   * Get the name of the file, minus the extension.
   * @return {string}
   */
  nameWithoutExtension() {
    return this.segments.name;
  }

  /**
   * Get the extension of the file.
   * @return {string}
   */
  extension() {
    return this.segments.ext;
  }

  /**
   * Get the absolute path to the file.
   * @return {string}
   */
  path() {
    return this.absolutePath;
  }

  /**
   * Get the relative path to the file, from the project root.
   * @return {string}
   */
  relativePath() {
    return path.relative(process.cwd(), this.path());
  }

  /**
   * Get the absolute path to the file, minus the extension.
   * @return {string}
   */
  pathWithoutExtension() {
    return this.segments.pathWithoutExt;
  }

  /**
   * Get the base directory of the file.
   * @return {string}
   */
  base() {
    return this.segments.base;
  }

  /**
   * Determine if the file is a directory.
   * @return {boolean}
   */
  isDirectory() {
    return this.segments.isDir;
  }

  /**
   * Determine if the path is a file, and not a directory.
   * @return {boolean}
   */
  isFile() {
    return this.segments.isFile;
  }

  /**
   * Write the given contents to the file.
   *
   * @param {string} body
   * @return {File}
   */
  write(body) {
    if (typeof body === 'object') {
      body = JSON.stringify(body, null, 4);
    }

    body = body + os.EOL;

    fs.writeFileSync(this.absolutePath, body);

    return this;
  }

  /**
   * Read the file's contents.
   * @return {string}
   */
  read() {
    return fs.readFileSync(this.path(), {
      encoding: 'utf-8'
    });
  }

  /**
   * Copy the current file to a new location.
   * @param {string} destination
   * @return {File}
   */
  copyTo(destination) {
    fs.copySync(this.path(), destination);
    return this;
  }

  /**
   * Rename the file.
   * @param {string} to
   * @return {File}
   */
  rename(to) {
    to = path.join(this.base(), to);
    fs.renameSync(this.path(), to);
    return new File(to);
  }

  /**
   * Parse the file path.
   * @return {object}
   */
  parse() {
    const parsed = path.parse(this.absolutePath);

    return {
      path: this.filePath,
      absolutePath: this.absolutePath,
      pathWithoutExt: path.join(parsed.dir, `${parsed.name}`),
      isDir: !parsed.ext && !parsed.name.endsWith('*'),
      isFile: !!parsed.ext,
      name: parsed.name,
      ext: parsed.ext,
      file: parsed.base,
      base: parsed.dir
    };
  }
}

module.exports = File;
