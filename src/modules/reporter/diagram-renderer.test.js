/**
 * @import {PageData} from '../shared/types.js'
 */

import { BASE_URL, PAGE_DATA } from '../shared/test-constants.js';
import { describe, expect, it } from 'vitest';
import { DiagramRenderer } from './diagram-renderer.js';

const FLOWCHART_LR = 'flowchart LR';

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
    path: '/b'
  }
];

const A_TO_B = '/a --> /b';

describe('diagrams', () => {
  it('should create a diagram of all links', () => {
    const diagramRenderer = new DiagramRenderer(PAGE_DATA_ARRAY);
    const links = diagramRenderer.links();
    expect(links).toContain(FLOWCHART_LR);
    expect(links).toContain(A_TO_B);
  });

  it('should create a diagram of incoming links', () => {
    const diagramRenderer = new DiagramRenderer(PAGE_DATA_ARRAY);
    const links = diagramRenderer.linksToPage(PAGE_DATA_ARRAY[1]);
    expect(links).toContain(FLOWCHART_LR);
    expect(links).toContain(A_TO_B);
  });

  it('should create a diagram of no incoming links', () => {
    const diagramRenderer = new DiagramRenderer(PAGE_DATA_ARRAY);
    const links = diagramRenderer.linksToPage(PAGE_DATA_ARRAY[0]);
    expect(links).toContain(FLOWCHART_LR);
    expect(links).not.toContain(A_TO_B);
  });

  it('should create a diagram of outgoing links', () => {
    const diagramRenderer = new DiagramRenderer(PAGE_DATA_ARRAY);
    const links = diagramRenderer.linksFromPage(PAGE_DATA_ARRAY[0]);
    expect(links).toContain(FLOWCHART_LR);
    expect(links).toContain(A_TO_B);
  });

  it('should create a diagram of no outgoing links', () => {
    const diagramRenderer = new DiagramRenderer(PAGE_DATA_ARRAY);
    const links = diagramRenderer.linksFromPage(PAGE_DATA_ARRAY[1]);
    expect(links).toContain(FLOWCHART_LR);
    expect(links).not.toContain(A_TO_B);
  });

  it('should return an empty string', () => {
    expect(DiagramRenderer.page(null)).toBe('');
  });

  it('should return a page without a title', () => {
    expect(
      DiagramRenderer.page({ ...PAGE_DATA, title: null })
    ).toContain(`"${PAGE_DATA.path}"`);
  });
});
