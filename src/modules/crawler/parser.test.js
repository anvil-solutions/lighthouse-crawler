import { describe, expect, it } from 'vitest';
import { BASE_URL } from '../shared/test-constants.js';
import { Parser } from './parser.js';

describe('parsing', () => {
  it('should parse', () => {
    const pageData = Parser.parse(
      BASE_URL,
      `
      <title>Title</title>
      <a href="/a">Link</a>
      <a href="https://google.com/b">Link</a>
      `
    );
    expect(pageData.title).toBe('Title');
    expect(pageData.links).toContain(`${BASE_URL}/a`);
    expect(pageData.links).not.toContain('https://google.com/b');
  });
});
