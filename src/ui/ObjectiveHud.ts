import Phaser from 'phaser';

/** Top-left objective chip with an accent bar. '' hides it; '…' is a
 *  legitimate objective — the game uses decay on purpose. */
export class ObjectiveHud {
  private bg: Phaser.GameObjects.Rectangle;
  private accent: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private text: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    this.bg = scene.add.rectangle(16, 14, 10, 10, 0x0d1016, 0.9)
      .setOrigin(0).setStrokeStyle(1, 0x39445a).setDepth(998).setAlpha(0);
    this.accent = scene.add.rectangle(16, 14, 3, 10, 0xe4c878, 0.95)
      .setOrigin(0).setDepth(999).setAlpha(0);
    this.label = scene.add.text(30, 22, 'OBJECTIVE', {
      fontFamily: 'GameFont, monospace', fontSize: '14px', color: '#5a6478',
    }).setDepth(1000).setAlpha(0);
    this.text = scene.add.text(30, 36, '', {
      fontFamily: 'GameFont, monospace', fontSize: '22px', color: '#e8e6df',
      wordWrap: { width: 440 },
    }).setDepth(1000).setAlpha(0);
  }

  set(objective: string): void {
    const targets = [this.bg, this.accent, this.label, this.text];
    // kill in-flight fades — overlapping set() calls were leaving it invisible
    this.scene.tweens.killTweensOf(targets);
    this.scene.tweens.add({
      targets,
      alpha: 0,
      duration: 250,
      onComplete: () => {
        this.text.setText(objective);
        const h = this.text.y - this.bg.y + this.text.height + 10;
        this.bg.setSize(Math.max(this.label.width, this.text.width) + 30, h);
        this.accent.setSize(3, h);
        if (objective !== '') {
          this.scene.tweens.killTweensOf(targets);
          this.scene.tweens.add({ targets, alpha: 1, duration: 400 });
        }
      },
    });
  }
}
