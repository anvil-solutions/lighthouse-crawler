import { describe, expect, it } from 'vitest';
import { getAverageScores, getScoreColor, getScoreString } from './utils.js';
import { PAGE_DATA } from '../shared/test-constants.js';

describe('average scores', () => {
  it('should get the average score', () => {
    expect(
      getAverageScores([
        {
          ...PAGE_DATA,
          result: null
        },
        {
          ...PAGE_DATA,
          result: {
            file: '',
            scores: {
              score: null
            }
          }
        },
        {
          ...PAGE_DATA,
          result: {
            file: '',
            scores: {
              score: 0
            }
          }
        },
        {
          ...PAGE_DATA,
          result: {
            file: '',
            scores: {
              score: 3,
              secondScore: 6
            }
          }
        }
      ])
    ).toStrictEqual({
      score: 1,
      secondScore: 2
    });
  });
});

describe('score colors', () => {
  it('should convert a score to green', () => {
    expect(getScoreColor(1)).toBe('green');
  });

  it('should convert a score to orange', () => {
    expect(getScoreColor(0.75)).toBe('orange');
  });

  it('should convert a score to red', () => {
    expect(getScoreColor(0)).toBe('red');
  });

  it('should convert null to red', () => {
    expect(getScoreColor(null)).toBe('red');
  });
});

describe('score strings', () => {
  it('should convert a score without decimal places', () => {
    expect(getScoreString(1)).toBe('1.00');
  });

  it('should convert a score with lots of decimal places', () => {
    expect(getScoreString(1.234_567_89)).toBe('1.23');
  });

  it('should convert null', () => {
    expect(getScoreString(null)).toBe('!');
  });
});
