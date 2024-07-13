/**
 * @import {Logger} from 'pino'
 */

import { Crawler } from './modules/crawler/crawler.js';
import {
  LighthouseRunner
} from './modules/lighthouse-runner/lighthouse-runner.js';
import { Reporter } from './modules/reporter/reporter.js';

/**
 * @typedef {object} Options
 * @property {string} start
 * @property {string} outputDirectory
 * @property {Logger | null} logger
 */

/**
 * @param {Options} options
 * @returns {Promise<void>}
 */
export async function generateReport(options) {
  const { start, outputDirectory, logger } = options;

  const crawler = new Crawler(start, logger);
  await crawler.crawl();

  const reporter = new Reporter(outputDirectory);
  await reporter.cleanOutput();
  const results = await LighthouseRunner.onList(
    outputDirectory,
    crawler.getResults(),
    logger
  );
  const reportFile = await reporter.createReport(results);

  logger?.info('View the generated report at "file://%s".', reportFile);
}
