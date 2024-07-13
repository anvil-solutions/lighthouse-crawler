/**
 * @import {Logger} from 'pino'
 * @import {PageData} from './types'
 */

import { vi } from 'vitest';

export const OUTPUT_DIRECTORY = 'out';

export const BASE_URL = 'https://example.com';

/** @type {PageData} */
export const PAGE_DATA = {
  links: [],
  location: BASE_URL,
  path: '',
  result: {
    file: '',
    scores: {
      score: 0
    }
  },
  title: ''
};

// @ts-expect-error Not a complete mock.
export const LOGGER_MOCK = /** @type {Logger} */({
  debug: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  trace: vi.fn(),
  warn: vi.fn()
});
