import { BASE_URL, LOGGER_MOCK } from '../shared/test-constants.js';
import { describe, expect, it, vi } from 'vitest';
import { get, getFormattedUrl, getFormattedUrlIfLocal } from './utils.js';

describe('fetching', () => {
  it('should get HTML', async () => {
    vi.stubGlobal('fetch', vi.fn(
      () => Promise.resolve({
        headers: new Headers({ 'Content-Type': 'text/html' }),
        text: () => Promise.resolve('')
      })
    ));

    expect(await get(BASE_URL, LOGGER_MOCK)).toBeTypeOf('string');
  });

  it('should get something else and return null', async () => {
    vi.stubGlobal('fetch', vi.fn(
      () => Promise.resolve({
        headers: new Headers({ 'Content-Type': 'text/plain' })
      })
    ));

    expect(await get(BASE_URL, LOGGER_MOCK)).toBeNull();
  });

  it('should fail and return null', async () => {
    vi.stubGlobal('fetch', vi.fn(
      () => Promise.resolve({
        text: () => Promise.reject(new Error('Fail.'))
      })
    ));

    expect(await get(BASE_URL, LOGGER_MOCK)).toBeNull();
  });
});

describe('formatted local URLs', () => {
  it('should return from absolute link', () => {
    expect(
      getFormattedUrlIfLocal(`${BASE_URL}/path`, BASE_URL)
    ).toBe(`${BASE_URL}/path`);
  });

  it('should return from local absolute link', () => {
    expect(getFormattedUrlIfLocal('/path', BASE_URL)).toBe(`${BASE_URL}/path`);
  });

  it('should return from relative link', () => {
    expect(
      getFormattedUrlIfLocal('../path', `${BASE_URL}/path`)
    ).toBe(`${BASE_URL}/path`);
  });

  it('should return null for parseable URLs', () => {
    expect(getFormattedUrlIfLocal('https://google.com/', BASE_URL)).toBeNull();
  });

  it('should return null for //', () => {
    expect(getFormattedUrlIfLocal('//google.com/', BASE_URL)).toBeNull();
  });

  it('should return null for invalid base', () => {
    expect(getFormattedUrlIfLocal('/path', 'string')).toBeNull();
  });
});

describe('formatted URLs', () => {
  it('should return a formatted URL', () => {
    expect(
      getFormattedUrl(`${BASE_URL}/path?123#456`)
    ).toBe(`${BASE_URL}/path`);
  });

  it('should throw an error', () => {
    expect(() => getFormattedUrl('')).toThrowError();
  });
});
