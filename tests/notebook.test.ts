import { describe, expect, it } from 'vitest';
import { Notebook } from '../src/engine/Notebook';

describe('Notebook', () => {
  it('stores entries verbatim, in insertion order', () => {
    const nb = new Notebook();
    nb.add('21:10', '"A bit of a fever." — "About an hour."');
    nb.add('22:20', '"Maybe two more hours."');
    expect(nb.entries()).toEqual([
      { time: '21:10', text: '"A bit of a fever." — "About an hour."' },
      { time: '22:20', text: '"Maybe two more hours."' },
    ]);
  });

  it('never dedupes — the contradiction ladder must stack', () => {
    const nb = new Notebook();
    nb.add('12:00', '"Soon."');
    nb.add('17:20', '"Soon."');
    expect(nb.entries()).toHaveLength(2);
  });

  it('entries() is a snapshot — mutating it does not affect the notebook', () => {
    const nb = new Notebook();
    nb.add('10:40', 'x');
    const snapshot = [...nb.entries()];
    snapshot.pop();
    expect(nb.entries()).toHaveLength(1);
  });
});
