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
   *
   * @param {string} file
   */
  static find(file) {
    return new File(file);
  }

  /**
   * Get the size of the file.
   */
  size() {
    return fs.statSync(this.path()).size;
  }

  /**
   * Determine if the given file exists.
   *
   * @param {string} file
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
   */
  name() {
    return this.segments.file;
  }

  /**
   * Get the name of the file, minus the extension.
   */
  nameWithoutExtension() {
    return this.segments.name;
  }

  /**
   * Get the extension of the file.
   */
  extension() {
    return this.segments.ext;
  }

  /**
   * Get the absolute path to the file.
   */
  path() {
    return this.absolutePath;
  }

  /**
   * Get the relative path to the file, from the project root.
   */
  relativePath() {
    return path.relative(process.cwd(), this.path());
  }

  /**
   * Get the absolute path to the file, minus the extension.
   */
  pathWithoutExtension() {
    return this.segments.pathWithoutExt;
  }

  /**
   * Get the base directory of the file.
   */
  base() {
    return this.segments.base;
  }

  /**
   * Determine if the file is a directory.
   */
  isDirectory() {
    return this.segments.isDir;
  }

  /**
   * Determine if the path is a file, and not a directory.
   */
  isFile() {
    return this.segments.isFile;
  }

  /**
   * Write the given contents to the file.
   *
   * @param {string} body
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
   */
  read() {
    return fs.readFileSync(this.path(), {
      encoding: 'utf-8'
    });
  }

  /**
   * Copy the current file to a new location.
   *
   * @param {string} destination
   */
  copyTo(destination) {
    fs.copySync(this.path(), destination);

    return this;
  }

  /**
   * Rename the file.
   *
   * @param {string} to
   */
  rename(to) {
    to = path.join(this.base(), to);

    fs.renameSync(this.path(), to);

    return new File(to);
  }

  /**
   * Parse the file path.
   */
  parse() {
    let parsed = path.parse(this.absolutePath);

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
