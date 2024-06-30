import { describe, expect, it } from 'vitest';
import { Layout } from './layout.js';

describe('layouts', () => {
  it('should create a layout from a layout', () => {
    expect(Layout.from(new Layout(''))).toBeInstanceOf(Layout);
  });

  it('should create a layout from a file', async () => {
    expect(await Layout.fromAssets('main')).toBeInstanceOf(Layout);
  });

  it('should create a layout with a string variable', () => {
    expect(
      new Layout('{{ variable }}')
        .addVariable('variable', 'string')
        .toString()
    ).toBe('string');
  });

  it('should create a layout with a layout variable', () => {
    expect(
      new Layout('{{ variable }}')
        .addVariable('variable', new Layout('layout'))
        .toString()
    ).toBe('layout');
  });
});
