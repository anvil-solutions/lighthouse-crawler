/**
 * @import {LaunchedChrome} from 'chrome-launcher'
 * @import {LighthouseResult} from '../shared/types.js'
 * @import {Logger} from 'pino'
 * @import {PageData} from '../shared/types.js'
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { padNumber } from '../shared/utils.js';
import path from 'node:path';

export class LighthouseRunner {
  /** @type {string} */
  #outputDirectory;

  /** @type {Promise<LaunchedChrome>} */
  #chrome;

  /**
   * @param {string} outputDirectory
   */
  constructor(outputDirectory) {
    this.#outputDirectory = path.normalize(outputDirectory);
    this.#chrome = launch({ chromeFlags: ['--headless'] });
  }

  /**
   * @param {string} outputDirectory
   * @param {PageData[]} pages
   * @param {Logger | null} logger
   * @returns {Promise<PageData[]>}
   */
  static async onList(outputDirectory, pages, logger) {
    const runner = new LighthouseRunner(
      path.join(outputDirectory, '/reports/')
    );
    for (let index = 0; index < pages.length; index++) {
      logger?.info(
        '[%s / %s] Testing "%s"',
        padNumber(index + 1),
        padNumber(pages.length),
        pages[index].path
      );
      // eslint-disable-next-line require-atomic-updates, no-await-in-loop -- Do not spam network requests.
      pages[index].result = await runner.run(pages[index].location);
    }
    await runner.kill();
    return pages;
  }

  /**
   * @param {string} url
   * @returns {Promise<LighthouseResult | null>}
   */
  async run(url) {
    const chrome = await this.#chrome;
    const result = await lighthouse(
      url,
      {
        extraHeaders: {
          'X-Test': '1'
        },
        onlyCategories: [
          'accessibility',
          'best-practices',
          'performance',
          'seo'
        ],
        output: 'html',
        port: chrome.port
      }
    ) ?? null;

    if (result === null) return null;

    const file = `${
      createHash('sha1')
        .update(url)
        .digest('base64url')
    }.html`;
    await mkdir(this.#outputDirectory, { recursive: true });
    await writeFile(
      path.join(this.#outputDirectory, file),
      result.report
    );

    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories)
        .map(([key, value]) => [key, value.score])
    );

    return { file, scores };
  }

  /**
   * @returns {Promise<void>}
   */
  async kill() {
    const chrome = await this.#chrome;
    chrome.kill();
  }
}
