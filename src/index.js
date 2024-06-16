#!/usr/bin/env node

import { Crawler } from './modules/crawler/crawler.js';
import {
  LighthouseRunner
} from './modules/lighthouse-runner/lighthouse-runner.js';
import { Reporter } from './modules/reporter/reporter.js';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const { start } = await yargs(hideBin(process.argv))
  .option('start', {
    alias: 's',
    default: 'http://localhost:80/',
    description: 'The URL to start with',
    type: 'string'
  })
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .argv;

const crawler = new Crawler(start);
await crawler.crawl();

await Reporter.cleanOutput();
const results = await LighthouseRunner.onList(crawler.getResults());
const reportFile = await Reporter.createReport(results);

process.stdout.write(`\nfile://${reportFile}\n`);
