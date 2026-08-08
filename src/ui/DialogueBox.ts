import Phaser from 'phaser';
import { audio } from '../engine/audio';

const TYPE_MS = 24;

/** Bottom dialogue box. Types text letter by letter; E/Space completes,
 *  then confirms. Resizes with the window. */
export class DialogueBox {
  private root: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private accent: Phaser.GameObjects.Rectangle;
  private speakerChip: Phaser.GameObjects.Rectangle;
  private textObj: Phaser.GameObjects.Text;
  private speakerObj: Phaser.GameObjects.Text;
  private hint: Phaser.GameObjects.Text;
  private full = '';
  private shown = 0;
  private timer?: Phaser.Time.TimerEvent;
  private resolve?: () => void;
  private boxW = 0;
  private boxH = 132;

  constructor(private scene: Phaser.Scene) {
    this.bg = scene.add.rectangle(0, 0, 10, 10, 0x0d1016, 0.94).setOrigin(0);
    this.bg.setStrokeStyle(1, 0x39445a);
    this.accent = scene.add.rectangle(0, 0, 3, 10, 0x8fa3bf, 0.9).setOrigin(0);
    this.speakerChip = scene.add.rectangle(14, -12, 10, 24, 0x1a2030, 1)
      .setOrigin(0).setStrokeStyle(1, 0x39445a).setVisible(false);
    this.speakerObj = scene.add.text(24, -6, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#a8bcd8',
    });
    this.textObj = scene.add.text(26, 20, '', {
      fontFamily: 'monospace', fontSize: '17px', color: '#e8e6df',
      lineSpacing: 7,
    });
    this.hint = scene.add.text(0, 0, '▾ E', {
      fontFamily: 'monospace', fontSize: '13px', color: '#5a6478',
    }).setOrigin(1).setVisible(false);
    this.root = scene.add.container(0, 0, [
      this.bg, this.accent, this.speakerChip, this.speakerObj, this.textObj, this.hint,
    ]);
    this.root.setDepth(1000).setVisible(false);
    this.layout();
    scene.scale.on('resize', () => this.layout());
  }

  private layout(): void {
    const sw = this.scene.scale.width;
    const sh = this.scene.scale.height;
    this.boxW = Math.min(sw - 64, 980);
    this.root.setPosition((sw - this.boxW) / 2, sh - this.boxH - 26);
    this.bg.setSize(this.boxW, this.boxH);
    this.accent.setSize(3, this.boxH);
    this.textObj.setWordWrapWidth(this.boxW - 52);
    this.hint.setPosition(this.boxW - 14, this.boxH - 12);
  }

  get open(): boolean {
    return this.root.visible;
  }

  /** All say() calls serialize through this chain — two overlapping dialogue
   *  sequences can never orphan each other's promise (which used to freeze
   *  the whole interaction system). */
  private chain: Promise<void> = Promise.resolve();

  say(speaker: string | undefined, text: string): Promise<void> {
    const run = () => this.doSay(speaker, text);
    this.chain = this.chain.then(run, run);
    return this.chain;
  }

  private doSay(speaker: string | undefined, text: string): Promise<void> {
    this.root.setVisible(true);
    const has = !!speaker;
    this.speakerChip.setVisible(has);
    this.speakerObj.setVisible(has).setText(speaker ? speaker.toUpperCase() : '');
    this.speakerChip.setSize(this.speakerObj.width + 20, 24);
    this.full = text;
    this.shown = 0;
    this.textObj.setText('');
    this.hint.setVisible(false);
    this.timer?.remove();
    this.timer = this.scene.time.addEvent({
      delay: TYPE_MS,
      loop: true,
      callback: () => {
        this.shown++;
        const ch = this.full[this.shown - 1];
        if (ch && ch !== ' ' && this.shown % 2 === 0) {
          audio.sfx('sfx/blip', { volume: 0.1, rate: 0.94 + Math.random() * 0.12 });
        }
        this.textObj.setText(this.full.slice(0, this.shown));
        if (this.shown >= this.full.length) {
          this.timer?.remove();
          this.hint.setVisible(true);
        }
      },
    });
    return new Promise((res) => {
      this.resolve = res;
    });
  }

  advance(): void {
    if (!this.root.visible) return;
    if (this.shown < this.full.length) {
      this.timer?.remove();
      this.shown = this.full.length;
      this.textObj.setText(this.full);
      this.hint.setVisible(true);
      return;
    }
    this.root.setVisible(false);
    const r = this.resolve;
    this.resolve = undefined;
    r?.();
  }
}
