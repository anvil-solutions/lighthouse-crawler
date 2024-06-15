import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import path from 'node:path';

export default class LighthouseRunner {
  /** @type {string} */
  #outputDirectory;

  /** @type {Promise<import('chrome-launcher').LaunchedChrome>} */
  #chrome;

  /**
   * @param {string} outputDirectory
   */
  constructor(outputDirectory) {
    this.#outputDirectory = path.normalize(outputDirectory);
    this.#chrome = launch({ chromeFlags: ['--headless'] });
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

const runner = new LighthouseRunner('./out/reports/');
console.warn(await runner.run('http://localhost:8000/'));
await runner.kill();
