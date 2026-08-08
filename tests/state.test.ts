import { beforeEach, describe, expect, it } from 'vitest';
import { gameState, resetGameState } from '../src/engine/GameState';

describe('GameState', () => {
  beforeEach(() => resetGameState());

  it('starts with no flags and answers has() false', () => {
    expect(gameState.has('nursery-done')).toBe(false);
  });

  it('set() makes has() true', () => {
    gameState.set('nursery-done');
    expect(gameState.has('nursery-done')).toBe(true);
  });

  it('clock is hidden until set', () => {
    expect(gameState.clock.visible).toBe(false);
    gameState.setClock('19:43');
    expect(gameState.clock.visible).toBe(true);
    expect(gameState.clock.hhmm).toBe('19:43');
  });

  it('setClock(null) hides the clock again', () => {
    gameState.setClock('19:43');
    gameState.setClock(null);
    expect(gameState.clock.visible).toBe(false);
  });

  it('reset clears flags, clock and chapter', () => {
    gameState.set('x');
    gameState.setClock('12:00');
    gameState.chapter = 'ch5';
    resetGameState();
    expect(gameState.has('x')).toBe(false);
    expect(gameState.clock.visible).toBe(false);
    expect(gameState.chapter).toBe('');
  });
});
