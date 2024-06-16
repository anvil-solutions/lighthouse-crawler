#!/usr/bin/env node

import { Crawler } from './modules/crawler/crawler.js';
import {
  LighthouseRunner
} from './modules/lighthouse-runner/lighthouse-runner.js';
import { Reporter } from './modules/reporter/reporter.js';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const { start, outputDirectory } = await yargs(hideBin(process.argv))
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
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .argv;

const crawler = new Crawler(start);
await crawler.crawl();

const reporter = new Reporter(outputDirectory);
await reporter.cleanOutput();
const results = await LighthouseRunner.onList(
  outputDirectory,
  crawler.getResults()
);
const reportFile = await reporter.createReport(results);

process.stdout.write(`\nfile://${reportFile}\n`);
