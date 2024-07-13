/**
 * @import {PageData} from '../shared/types'
 */

export const BEST_PRACTICES = 'best-practices';

/**
 * @param {PageData[]} pages
 * @returns {Record<string, number | null>}
 */
export function getAverageScores(pages) {
  const results = /** @type {Record<string, number | null>[]} */ (
    pages
      .filter(page => (page.result ?? null) !== null)
      .map(page => page.result?.scores)
  );
  return results.reduce(
    (previous, current, _, { length }) => {
      for (const [key, value] of Object.entries(current)) {
        if (!(key in previous)) previous[key] = 0;
        previous[key] = (previous[key] ?? 0) + (value ?? 0) / length;
      }
      return previous;
    },
    {}
  );
}

/**
 * @param {number | null} score
 * @returns {string}
 */
export function getScoreColor(score = null) {
  if (score === null || score < 0.5) return 'red';
  else if (score < 0.9) return 'orange';
  return 'green';
}

/**
 * @param {number | null} score
 * @returns {string}
 */
export function getScoreString(score = null) {
  return score?.toFixed(2) ?? '!';
}
