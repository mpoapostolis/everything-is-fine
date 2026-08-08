import Phaser from 'phaser';

/** Top-right clock: big time, the day above it. Accepts "13:20" or
 *  "MON 13:20" — the day sticks until a new one is given. */
export class ClockHud {
  private bg: Phaser.GameObjects.Rectangle;
  private inner: Phaser.GameObjects.Rectangle;
  private accent: Phaser.GameObjects.Rectangle;
  private dayText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private day = '';

  constructor(private scene: Phaser.Scene) {
    this.bg = scene.add.rectangle(0, 12, 130, 58, 0x0d1016, 0.92)
      .setOrigin(1, 0).setStrokeStyle(1, 0x39445a).setDepth(998).setVisible(false);
    this.inner = scene.add.rectangle(0, 14, 126, 54, 0x121826, 0.5)
      .setOrigin(1, 0).setDepth(998).setVisible(false);
    this.accent = scene.add.rectangle(0, 12, 3, 58, 0x8fa3bf, 1)
      .setOrigin(1, 0).setDepth(999).setVisible(false);
    this.dayText = scene.add.text(0, 19, '', {
      fontFamily: 'monospace', fontSize: '11px', color: '#6a7488',
      letterSpacing: 3,
    }).setOrigin(1, 0).setDepth(1000).setVisible(false);
    this.timeText = scene.add.text(0, 33, '', {
      fontFamily: 'monospace', fontSize: '27px', color: '#dce6f4',
      stroke: '#0a0e16', strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(1000).setVisible(false);
    this.layout();
    scene.scale.on('resize', () => this.layout());
  }

  private layout(): void {
    const right = this.scene.scale.width - 18;
    this.bg.setX(right);
    this.inner.setX(right - 2);
    this.accent.setX(right - this.bg.width + 3);
    this.dayText.setX(right - 14);
    this.timeText.setX(right - 12);
  }

  set(value: string | null): void {
    const visible = value !== null;
    for (const o of [this.bg, this.inner, this.accent, this.dayText, this.timeText]) {
      o.setVisible(visible);
    }
    if (value === null) return;
    const parts = value.split(' ');
    if (parts.length === 2) {
      this.day = parts[0].toUpperCase();
    }
    const time = parts[parts.length - 1];
    this.dayText.setText(this.day ? { MON: 'MONDAY', TUE: 'TUESDAY' }[this.day] ?? this.day : '');
    this.timeText.setText(time);
    const w = Math.max(this.timeText.width + 30, this.dayText.width + 34, 120);
    this.bg.setSize(w, 58);
    this.inner.setSize(w - 4, 54);
    this.accent.setSize(3, 58);
    this.layout();
    // a small breath on every time change — the hours are the antagonist
    this.scene.tweens.add({
      targets: this.timeText, alpha: 0.4, duration: 120, yoyo: true, repeat: 1,
    });
  }
}
