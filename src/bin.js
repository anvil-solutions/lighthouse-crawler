#!/usr/bin/env node

import { generateReport } from './index.js';
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

await generateReport({ logger, outputDirectory, start });
