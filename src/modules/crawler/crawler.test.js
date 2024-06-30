import { BASE_URL, LOGGER_MOCK } from '../shared/test-constants.js';
import { describe, expect, it, vi } from 'vitest';
import { Crawler } from './crawler.js';

describe('crawling', () => {
  it('should crawl', async () => {
    vi.stubGlobal('fetch', vi.fn(
      () => Promise.resolve({
        headers: new Headers({ 'Content-Type': 'text/html' }),
        text: () => Promise.resolve('<a href="/a"></a>')
      })
    ));

    const crawler = new Crawler(BASE_URL, LOGGER_MOCK);
    await crawler.crawl();
    const results = crawler.getResults();
    expect(results.length).toBe(2);
    expect(results[0].links.length).toBe(1);
    expect(results[0].links[0]).toBe(`${BASE_URL}/a`);
  });

  it('should be empty', async () => {
    vi.stubGlobal('fetch', vi.fn(
      () => Promise.reject(new Error('Fail.'))
    ));

    const crawler = new Crawler(BASE_URL, LOGGER_MOCK);
    await crawler.crawl();
    const results = crawler.getResults();
    expect(results.length).toBe(0);
  });
});
