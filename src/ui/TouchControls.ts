import Phaser from 'phaser';

/** On-screen controls for touch devices. Everything is routed through
 *  synthetic keyboard events, so every existing system (movement, prompts,
 *  dialogue advance, hold-E signature) works unchanged. */
export class TouchControls {
  private base: Phaser.GameObjects.Arc;
  private knob: Phaser.GameObjects.Arc;
  private stickId: number | null = null;
  private origin = new Phaser.Math.Vector2();
  private held: Record<string, boolean> = {};
  private buttons: Array<{ zone: Phaser.GameObjects.Arc; label: Phaser.GameObjects.Text; place: () => [number, number] }> = [];

  /** Should the controls exist at all? Coarse pointer = phone/tablet. */
  static wanted(): boolean {
    return typeof window !== 'undefined'
      && !!window.matchMedia
      && window.matchMedia('(pointer: coarse)').matches;
  }

  constructor(private scene: Phaser.Scene) {
    scene.input.addPointer(3); // stick + button + one spare

    this.base = scene.add.circle(0, 0, 56, 0xffffff, 0.05)
      .setStrokeStyle(2, 0xffffff, 0.16).setDepth(2600).setVisible(false);
    this.knob = scene.add.circle(0, 0, 26, 0xffffff, 0.13).setDepth(2601).setVisible(false);

    this.makeButton('E', 46, () => this.key('e', 'KeyE', 69, true), () => this.key('e', 'KeyE', 69, false),
      () => [scene.scale.width - 84, scene.scale.height - 96]);
    this.makeButton('N', 26, () => this.key('n', 'KeyN', 78, true), () => this.key('n', 'KeyN', 78, false),
      () => [scene.scale.width - 178, scene.scale.height - 72]);
    // the phone: without this, mobile players could never call her
    this.makeButton('C', 26, () => this.key('c', 'KeyC', 67, true), () => this.key('c', 'KeyC', 67, false),
      () => [scene.scale.width - 244, scene.scale.height - 60]);

    // floating joystick on the left half
    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.x > scene.scale.width * 0.5 || this.stickId !== null) return;
      this.stickId = p.id;
      this.origin.set(p.x, p.y);
      this.base.setPosition(p.x, p.y).setVisible(true);
      this.knob.setPosition(p.x, p.y).setVisible(true);
    });
    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.id !== this.stickId) return;
      const dx = p.x - this.origin.x;
      const dy = p.y - this.origin.y;
      const len = Math.hypot(dx, dy);
      const cap = Math.min(len, 48);
      const nx = len > 0 ? dx / len : 0;
      const ny = len > 0 ? dy / len : 0;
      this.knob.setPosition(this.origin.x + nx * cap, this.origin.y + ny * cap);
      const on = len > 16;
      const TH = 0.42;
      this.dir('ArrowLeft', 37, on && nx < -TH);
      this.dir('ArrowRight', 39, on && nx > TH);
      this.dir('ArrowUp', 38, on && ny < -TH);
      this.dir('ArrowDown', 40, on && ny > TH);
    });
    const endStick = (p: Phaser.Input.Pointer) => {
      if (p.id !== this.stickId) return;
      this.stickId = null;
      this.base.setVisible(false);
      this.knob.setVisible(false);
      this.dir('ArrowLeft', 37, false);
      this.dir('ArrowRight', 39, false);
      this.dir('ArrowUp', 38, false);
      this.dir('ArrowDown', 40, false);
    };
    scene.input.on('pointerup', endStick);
    scene.input.on('pointerupoutside', endStick);

    scene.scale.on('resize', () => this.layout());
    this.layout();
  }

  private makeButton(
    label: string,
    radius: number,
    onDown: () => void,
    onUp: () => void,
    place: () => [number, number],
  ): void {
    const zone = this.scene.add.circle(0, 0, radius, 0xffffff, 0.07)
      .setStrokeStyle(2, 0xffffff, 0.22).setDepth(2600)
      .setInteractive({ useHandCursor: false });
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'GameFont, monospace', fontSize: `${Math.round(radius * 0.8)}px`, color: '#c8d0dc',
    }).setOrigin(0.5).setDepth(2601).setAlpha(0.75);
    zone.on('pointerdown', () => { zone.setFillStyle(0xffffff, 0.18); onDown(); });
    const release = () => { zone.setFillStyle(0xffffff, 0.07); onUp(); };
    zone.on('pointerup', release);
    zone.on('pointerout', release);
    this.buttons.push({ zone, label: text, place });
  }

  private layout(): void {
    for (const b of this.buttons) {
      const [x, y] = b.place();
      b.zone.setPosition(x, y);
      b.label.setPosition(x, y);
    }
  }

  private dir(code: string, kc: number, want: boolean): void {
    if (this.held[code] === want) return;
    this.held[code] = want;
    this.key(code, code, kc, want);
  }

  private key(key: string, code: string, kc: number, down: boolean): void {
    window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', {
      key, code, keyCode: kc, which: kc, bubbles: true,
    }));
  }
}
