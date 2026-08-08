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
      await ui.timeCard(S.card1, 2400, true);
      await ui.timeCard(S.card2, 2400, true);
      await ui.timeCard(S.card3, 2600, true);
      await ui.timeCard(S.card4, 2600, true);

      const cx = this.scale.width / 2;
      const cy = this.scale.height / 2;
      const title = this.add.text(cx, cy - 24, S.title, {
        fontFamily: 'GameFont, monospace', fontSize: '54px', color: '#e8e6df',
      }).setOrigin(0.5).setAlpha(0).setDepth(2100);
      const sub = this.add.text(cx, cy + 26, S.sub, {
        fontFamily: 'GameFont, monospace', fontSize: '20px', color: '#5a6478',
      }).setOrigin(0.5).setAlpha(0).setDepth(2100);
      const born = this.add.text(cx, cy + 52, S.born, {
        fontFamily: 'GameFont, monospace', fontSize: '18px', color: '#5a6478',
      }).setOrigin(0.5).setAlpha(0).setDepth(2100);
      // the last thing anyone reads — his voice, to the baby
      const ded = this.add.text(cx, cy + 110, S.dedication, {
        fontFamily: 'GameFont, monospace', fontSize: '21px', fontStyle: 'italic', color: '#9aa6ba',
      }).setOrigin(0.5).setAlpha(0).setDepth(2100);
      await ui.fadeIn(10);
      this.tweens.add({ targets: title, alpha: 1, duration: 2200, delay: 600 });
      this.tweens.add({ targets: sub, alpha: 1, duration: 1800, delay: 2200 });
      this.tweens.add({ targets: born, alpha: 1, duration: 1800, delay: 3200 });
      this.tweens.add({ targets: ded, alpha: 1, duration: 2600, delay: 5400 });
    })();
  }
}
