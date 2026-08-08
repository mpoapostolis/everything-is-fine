/** Global, scene-independent game state: flags, diegetic clock, chapter id. */
export class GameState {
  flags = new Set<string>();
  clock: { visible: boolean; hhmm: string } = { visible: false, hhmm: '' };
  chapter = '';

  set(flag: string): void {
    this.flags.add(flag);
  }

  has(flag: string): boolean {
    return this.flags.has(flag);
  }

  setClock(hhmm: string | null): void {
    if (hhmm === null) {
      this.clock = { visible: false, hhmm: '' };
    } else {
      this.clock = { visible: true, hhmm };
    }
  }
}

export let gameState = new GameState();

export function resetGameState(): void {
  gameState = new GameState();
}
