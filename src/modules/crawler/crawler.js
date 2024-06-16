import { get, getFormattedUrl } from './utils.js';
import { Parser } from './parser.js';

export class Crawler {
  /** @type {string} */
  #startUrl;

  /** @type {string} */
  #baseUrl;

  /** @type {Set<string>} */
  #visited = new Set();

  /** @type {PageData[]} */
  #results = [];

  /**
   * @param {string} startUrl
   */
  constructor(startUrl) {
    this.#startUrl = getFormattedUrl(startUrl);
    this.#baseUrl = new URL(this.#startUrl).origin;
  }

  /**
   * @param {string} url
   * @returns {Promise<void>}
   */
  async crawl(url = this.#startUrl) {
    const formattedUrl = getFormattedUrl(url);
    if (this.#visited.has(formattedUrl)) return;

    this.#visited.add(formattedUrl);
    const response = await get(formattedUrl);
    if (response === null) return;

    const pageData = {
      ...Parser.parse(this.#baseUrl, response),
      location: formattedUrl,
      path: new URL(formattedUrl).pathname
    };
    this.#results.push(pageData);

    // eslint-disable-next-line no-await-in-loop -- Do not spam network requests.
    for (const location of pageData.links) await this.crawl(location);
  }

  /**
   * @returns {PageData[]}
   */
  getResults() {
    return this.#results.sort(
      (first, second) => first.path.localeCompare(second.path)
    );
  }
}
