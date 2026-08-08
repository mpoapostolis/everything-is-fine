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

    // checkpoint: offer to continue where they left off
    let checkpoint: { scene: string; phase?: number } | null = null;
    try {
      const raw = localStorage.getItem('eif-checkpoint');
      if (raw) checkpoint = JSON.parse(raw);
    } catch { /* storage unavailable */ }
    const hasCheckpoint = !!checkpoint && checkpoint.scene !== 'Prologue';

    const placeNames: Record<string, string> = {
      Checkup: 'the check-up', Waters: 'home', Delivery: 'the delivery room',
      Corridor: 'the corridor', Nicu: 'the NICU', HomeCall: 'home, alone',
      Signature: 'the consent form', Ward: 'the ward', Finale: 'the homecoming',
    };
    const where = hasCheckpoint && checkpoint ? placeNames[checkpoint.scene] : undefined;
    const begin = this.add.text(cx, cy + 90,
      where ? `— press any key to continue: ${where} —` : '— press any key to begin —', {
        fontFamily: 'GameFont, monospace', fontSize: '24px', color: '#c8d0dc',
      }).setOrigin(0.5);
    this.tweens.add({ targets: begin, alpha: 0.25, duration: 900, yoyo: true, repeat: -1 });
    if (hasCheckpoint) {
      this.add.text(cx, cy + 126, 'R — start over from the beginning', {
        fontFamily: 'GameFont, monospace', fontSize: '17px', color: '#5a6478',
      }).setOrigin(0.5);
    }
    this.add.text(cx, cy + 160,
      'This game depicts childbirth complications and infant intensive care.', {
        fontFamily: 'GameFont, monospace', fontSize: '15px', color: '#4a5468',
      }).setOrigin(0.5);

    this.add.text(cx, this.scale.height - 28,
      'arrows / WASD — walk      E — interact      N — notebook      H — help      F — fullscreen', {
        fontFamily: 'GameFont, monospace', fontSize: '17px', color: '#5a6478',
      }).setOrigin(0.5);

    const start = (fresh: boolean) => {
      const params = new URLSearchParams(window.location.search);
      // every query param becomes scene data (numbers arrive as numbers),
      // so ?scene=Corridor&phase=2 resumes exactly there
      const data: Record<string, unknown> = {};
      params.forEach((v, k) => {
        data[k] = /^\d+$/.test(v) ? Number(v) : v;
      });
      let target = params.get('scene') ?? 'Prologue';
      if (params.get('scene')) {
        // dev/debug jump — it must NOT overwrite the real checkpoint
        this.registry.set('devJump', true);
      } else if (!fresh && hasCheckpoint && checkpoint) {
        target = checkpoint.scene;
        if (checkpoint.phase !== undefined) data.phase = checkpoint.phase;
      }
      if (fresh) {
        try { localStorage.removeItem('eif-checkpoint'); } catch { /* ok */ }
      }
      this.scene.launch('Ui');
      this.scene.start(target, data);
    };
    this.input.keyboard!.once('keydown', (ev: KeyboardEvent) => start(ev.key === 'r' || ev.key === 'R'));
    this.input.once('pointerdown', () => start(false));
  }
}
