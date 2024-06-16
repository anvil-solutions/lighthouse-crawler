#!/usr/bin/env node

import { Crawler } from './modules/crawler/crawler.js';
import {
  LighthouseRunner
} from './modules/lighthouse-runner/lighthouse-runner.js';
import { Reporter } from './modules/reporter/reporter.js';
import { hideBin } from 'yargs/helpers';
import { pino } from 'pino';
import yargs from 'yargs/yargs';

const { start, outputDirectory, logLevel } = await yargs(hideBin(process.argv))
  .option('start', {
    alias: 's',
    demandOption: true,
    description: 'The URL to start with',
    requiresArg: true,
    type: 'string'
  })
  .option('output-directory', {
    alias: 'o',
    default: './out/',
    description: 'The output directory',
    requiresArg: true,
    type: 'string'
  })
  .option('log-level', {
    alias: 'l',
    default: 'info',
    description: 'The log level',
    requiresArg: true,
    type: 'string'
  })
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .argv;

const logger = pino({
  level: logLevel,
  transport: {
    options: {
      colorize: true
    },
    target: 'pino-pretty'
  }
});

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

logger.info('View the generated report at "file://%s".', reportFile);
