/**
 * @import {Logger} from 'pino'
 * @import {PageData} from '../shared/types.js'
 */

import { get, getFormattedUrl } from './utils.js';
import { Parser } from './parser.js';
import { padNumber } from '../shared/utils.js';

export class Crawler {
  /** @type {string} */
  #startUrl;

  /** @type {Logger | null} */
  #logger;

  /** @type {Set<string>} */
  #visited = new Set();

  /** @type {PageData[]} */
  #results = [];

  /**
   * @param {string} startUrl
   * @param {Logger | null} logger
   */
  constructor(startUrl, logger) {
    this.#startUrl = getFormattedUrl(startUrl);
    this.#logger = logger;
  }

  /**
   * @param {string} url
   * @returns {Promise<void>}
   */
  async crawl(url = this.#startUrl) {
    const formattedUrl = getFormattedUrl(url);
    if (this.#visited.has(formattedUrl)) return;

    this.#visited.add(formattedUrl);
    const response = await get(formattedUrl, this.#logger);
    if (response === null) return;

    const pageData = {
      ...Parser.parse(url, response),
      location: formattedUrl,
      path: new URL(formattedUrl).pathname
    };
    this.#results.push(pageData);
    this.#logger?.debug(
      '[%s] Visited "%s"',
      padNumber(this.#results.length),
      pageData.path
    );

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
