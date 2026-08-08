import Phaser from 'phaser';
import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import type { UiScene } from './UiScene';

const S = EN.end;

/** CHAPTERS 13–15, compressed — and the title, finally true. */
export class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  create(): void {
    const ui = this.scene.get('Ui') as UiScene;
    audio.allStop();
    audio.setMusic('music/ending', 0.4);
    ui.port.setClock(null);
    ui.port.setObjective('');

    void (async () => {
      // the four days, compressed — then the player goes HOME, playable
      await ui.timeCard(S.card1, 2400, true);
      await ui.timeCard(S.card2, 2400, true);
      await ui.timeCard(S.card3, 2800, true);
      this.scene.start('Finale');
    })();
  }
}
