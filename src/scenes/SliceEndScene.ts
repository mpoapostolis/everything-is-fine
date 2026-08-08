import Phaser from 'phaser';
import { GameConfig } from '../config';
import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import type { UiScene } from './UiScene';

/** End card for the vertical slice. */
export class SliceEndScene extends Phaser.Scene {
  constructor() {
    super('SliceEnd');
  }

  create(): void {
    void (this.scene.get('Ui') as UiScene).fadeIn(1000);
    audio.setAmbience(null);
    audio.setLayer(null);
    audio.setMusic('music/ending', 0.4);
    const cx = GameConfig.WIDTH / 2;
    const cy = GameConfig.HEIGHT / 2;
    const title = this.add.text(cx, cy - 40, EN.sliceEnd.title, {
      fontFamily: 'monospace', fontSize: '20px', color: '#8fa3bf',
    }).setOrigin(0.5).setAlpha(0);
    const game = this.add.text(cx, cy + 10, EN.sliceEnd.game, {
      fontFamily: 'monospace', fontSize: '30px', color: '#e8e6df',
    }).setOrigin(0.5).setAlpha(0);
    const sub = this.add.text(cx, cy + 60, EN.sliceEnd.sub, {
      fontFamily: 'monospace', fontSize: '13px', color: '#5a6478',
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, duration: 1200, delay: 400 });
    this.tweens.add({ targets: game, alpha: 1, duration: 1600, delay: 1600 });
    this.tweens.add({ targets: sub, alpha: 1, duration: 1200, delay: 2600 });
  }
}
