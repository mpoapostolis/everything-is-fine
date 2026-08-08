import { beforeEach, describe, expect, it } from 'vitest';
import { gameState, resetGameState } from '../src/engine/GameState';
import { Notebook } from '../src/engine/Notebook';
import { ScriptRunner } from '../src/engine/ScriptRunner';
import type { Step, UiPort } from '../src/engine/types';

function fakeUi(log: string[]): UiPort {
  return {
    say: async (speaker, text) => {
      log.push(`say:${speaker ?? ''}:${text}`);
    },
    setObjective: (t) => log.push(`obj:${t}`),
    setClock: (t) => log.push(`clock:${t ?? 'off'}`),
  };
}

describe('ScriptRunner', () => {
  beforeEach(() => resetGameState());

  it('executes steps in order and awaits dialogue', async () => {
    const log: string[] = [];
    const notebook = new Notebook();
    const runner = new ScriptRunner({ state: gameState, notebook, ui: fakeUi(log) });
    const steps: Step[] = [
      { objective: 'Go home.' },
      { say: { speaker: 'OB', text: 'Everything looks fine.' } },
      { note: { time: '10:40', text: '"Everything\'s fine."' } },
      { flag: 'checkup-done' },
      { clock: '19:43' },
    ];
    await runner.run(steps);
    expect(log).toEqual([
      'obj:Go home.',
      'say:OB:Everything looks fine.',
      'clock:19:43',
    ]);
    expect(notebook.entries()).toEqual([{ time: '10:40', text: '"Everything\'s fine."' }]);
    expect(gameState.has('checkup-done')).toBe(true);
    expect(gameState.clock.hhmm).toBe('19:43');
  });

  it('objective "" clears and clock null hides', async () => {
    const log: string[] = [];
    const runner = new ScriptRunner({ state: gameState, notebook: new Notebook(), ui: fakeUi(log) });
    await runner.run([{ objective: '' }, { clock: null }]);
    expect(log).toEqual(['obj:', 'clock:off']);
    expect(gameState.clock.visible).toBe(false);
  });

  it('call steps run with the script context', async () => {
    const log: string[] = [];
    const runner = new ScriptRunner({ state: gameState, notebook: new Notebook(), ui: fakeUi(log) });
    await runner.run([{ call: (ctx) => ctx.state.set('from-call') }]);
    expect(gameState.has('from-call')).toBe(true);
  });
});
