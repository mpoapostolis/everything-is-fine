import { describe, expect, it } from 'vitest';
import { corridorSegments } from '../src/engine/geometry';

describe('corridorSegments', () => {
  it('starts at 3 segments when nothing is unresolved', () => {
    expect(corridorSegments(0)).toBe(3);
  });

  it('adds one segment per unresolved contradiction', () => {
    expect(corridorSegments(1)).toBe(4);
    expect(corridorSegments(2)).toBe(5);
  });

  it('never shrinks below base for negative input', () => {
    expect(corridorSegments(-3)).toBe(3);
  });
});
