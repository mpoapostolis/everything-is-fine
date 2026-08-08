import Phaser from 'phaser';
import { ASSETS } from '../data/assetIndex';
import { AUDIO, audio } from '../engine/audio';

/** Loading screen → "press to begin" gate (which also unlocks web audio),
 *  then hands off to the requested scene (?scene=X, default Prologue). */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.add.text(cx, cy - 90, 'EVERYTHING IS FINE', {
      fontFamily: 'GameFont, monospace', fontSize: '52px', color: '#e8e6df',
    }).setOrigin(0.5);
    this.add.text(cx, cy - 52, 'a true story', {
      fontFamily: 'GameFont, monospace', fontSize: '20px', color: '#5a6478',
    }).setOrigin(0.5);

    const barW = 320;
    this.add.rectangle(cx, cy + 10, barW + 6, 14, 0x10131a)
      .setStrokeStyle(1, 0x3a4356);
    const fill = this.add.rectangle(cx - barW / 2, cy + 10, 1, 8, 0x8fa3bf).setOrigin(0, 0.5);
    const pct = this.add.text(cx, cy + 34, '0%', {
      fontFamily: 'GameFont, monospace', fontSize: '17px', color: '#5a6478',
    }).setOrigin(0.5);

    this.load.on('progress', (p: number) => {
      fill.width = Math.max(1, barW * p);
      pct.setText(`${Math.round(p * 100)}%`);
    });

    for (const [key, url] of Object.entries(ASSETS)) {
      this.load.image(key, url);
    }
    for (const [key, url] of Object.entries(AUDIO)) {
      this.load.audio(key, url);
    }
  }

  create(): void {
    audio.attach(this.game);
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    const begin = this.add.text(cx, cy + 90, '— press any key to begin —', {
      fontFamily: 'GameFont, monospace', fontSize: '24px', color: '#c8d0dc',
    }).setOrigin(0.5);
    this.tweens.add({ targets: begin, alpha: 0.25, duration: 900, yoyo: true, repeat: -1 });

    this.add.text(cx, this.scale.height - 28,
      'arrows / WASD — walk      E — interact      N — notebook      H — help      F — fullscreen', {
        fontFamily: 'GameFont, monospace', fontSize: '17px', color: '#5a6478',
      }).setOrigin(0.5);

    const start = () => {
      const params = new URLSearchParams(window.location.search);
      // every query param becomes scene data (numbers arrive as numbers),
      // so ?scene=Corridor&phase=2 resumes exactly there
      const data: Record<string, unknown> = {};
      params.forEach((v, k) => {
        data[k] = /^\d+$/.test(v) ? Number(v) : v;
      });
      this.scene.launch('Ui');
      this.scene.start(params.get('scene') ?? 'Prologue', data);
    };
    this.input.keyboard!.once('keydown', start);
    this.input.once('pointerdown', start);
  }
}
