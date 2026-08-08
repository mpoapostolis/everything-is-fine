import type { GameState } from './GameState';
import type { Notebook } from './Notebook';

/** One beat of a chapter script. Executed strictly in order. */
export type Step =
  | { say: { speaker?: string; text: string } }
  | { objective: string } // '' hides; '…' is a valid objective
  | { note: { time: string; text: string } }
  | { flag: string }
  | { clock: string | null } // null hides the clock
  | { wait: number } // ms, not skippable
  | { call: (ctx: ScriptContext) => Promise<void> | void };

/** What scripts are allowed to touch. Scenes provide the real UI;
 *  tests provide a fake — scripts cannot tell the difference. */
export interface UiPort {
  say(speaker: string | undefined, text: string): Promise<void>;
  setObjective(text: string): void;
  setClock(hhmm: string | null): void;
}

export interface ScriptContext {
  state: GameState;
  notebook: Notebook;
  ui: UiPort;
}
