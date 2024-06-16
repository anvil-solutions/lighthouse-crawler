import path from 'node:path';
import { readFile } from 'node:fs/promises';

export class Layout {
  /** @type {string} */
  #layout;

  /** @type {[string, Layout][]} */
  #variables = [];

  /**
   * @param {string} layout
   */
  constructor(layout) {
    this.#layout = layout;
  }

  /**
   * @param {Layout} layout
   * @returns {Layout}
   */
  static from(layout) {
    return new Layout(layout.#layout);
  }

  /**
   * @param {string} name
   * @returns {Promise<Layout>}
   */
  static async fromAssets(name) {
    const file = await readFile(
      path.join(import.meta.dirname, `../../assets/layout/${name}.html`)
    );
    return new Layout(file.toString());
  }

  /**
   * @param {string} key
   * @param {string | Layout} value
   * @returns {Layout}
   */
  addVariable(key, value) {
    this.#variables.push(
      value instanceof Layout
        ? [key, value]
        : [key, new Layout(value)]
    );
    return this;
  }

  /**
   * @returns {string}
   */
  toString() {
    let string = this.#layout;
    for (const [key, value] of this.#variables) string = string.replaceAll(
      `{{ ${key} }}`,
      value.toString()
    );
    return string;
  }
}
