import Phaser from 'phaser';

/** Floating "[E] verb" prompt above the nearest interactable (world space). */
export class InteractPrompt {
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(0, 0, '', {
      fontFamily: 'GameFont, monospace', fontSize: '13px', color: '#e8e6df',
      backgroundColor: '#10131acc', padding: { x: 5, y: 3 },
    }).setOrigin(0.5, 1).setDepth(900).setVisible(false);
  }

  showAt(x: number, y: number, verb: string): void {
    this.text.setPosition(x, y).setText(`[E] ${verb}`).setVisible(true);
  }

  hide(): void {
    this.text.setVisible(false);
  }
}
