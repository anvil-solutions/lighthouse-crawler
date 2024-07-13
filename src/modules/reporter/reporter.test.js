/**
 * @import {PageData} from '../shared/types.js'
 */

import {
  BASE_URL,
  OUTPUT_DIRECTORY,
  PAGE_DATA
} from '../shared/test-constants.js';
import { describe, expect, it } from 'vitest';
import { Reporter } from './reporter.js';
import { stat } from 'node:fs/promises';

/** @type {PageData[]} */
const PAGE_DATA_ARRAY = [
  {
    ...PAGE_DATA,
    links: [`${BASE_URL}/b`],
    location: `${BASE_URL}/a`,
    path: '/a'
  },
  {
    ...PAGE_DATA,
    location: `${BASE_URL}/b`,
    path: '/b',
    result: null,
    title: null
  }
];

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

describe('reporting', () => {
  it('should create a report', async () => {
    const reporter = new Reporter(OUTPUT_DIRECTORY);
    await reporter.cleanOutput();
    await reporter.createReport(PAGE_DATA_ARRAY);
    expect(await exists(OUTPUT_DIRECTORY)).toBe(true);
  });
});
