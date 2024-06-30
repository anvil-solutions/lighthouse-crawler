import {
  LOGGER_MOCK,
  OUTPUT_DIRECTORY,
  PAGE_DATA
} from '../shared/test-constants.js';
import { describe, expect, it, vi } from 'vitest';
import { LighthouseRunner } from './lighthouse-runner.js';
import lighthouse from 'lighthouse';

/** @type {PageData[]} */
const PAGE_DATA_ARRAY = [PAGE_DATA];

vi.mock('chrome-launcher', () => ({
  launch: vi.fn(
    () => Promise.resolve({ kill: vi.fn(() => Promise.resolve()) })
  )
}));

vi.mock('lighthouse');

describe('lighthouse runner', () => {
  it('should run on a list', async () => {
    vi.mocked(lighthouse).mockResolvedValue(
      // @ts-expect-error Not a complete mock.
      { lhr: { categories: {} }, report: '' }
    );

    const pages = await LighthouseRunner.onList(
      OUTPUT_DIRECTORY,
      PAGE_DATA_ARRAY,
      LOGGER_MOCK
    );
    expect(pages.length).toBe(PAGE_DATA_ARRAY.length);
  });

  it('should return null on fail', async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined, no-undefined
    vi.mocked(lighthouse).mockResolvedValue(undefined);

    const pages = await LighthouseRunner.onList(
      OUTPUT_DIRECTORY,
      PAGE_DATA_ARRAY,
      LOGGER_MOCK
    );
    expect(pages.length).toBe(PAGE_DATA_ARRAY.length);
  });
});
