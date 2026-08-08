import Phaser from 'phaser';
import { audio } from '../engine/audio';

export type Facing = 'down' | 'up' | 'left' | 'right';

const SPEED = 110; // nobody runs in this hospital (except Ch 9)
const STEP_MS = 190;
const FOOTSTEP_MS = 340;

/** 4-direction walking character built from individual frame images. */
export class PlayerController {
  sprite: Phaser.Physics.Arcade.Sprite;
  facing: Facing = 'down';
  private locked = false;
  private stepAccum = 0;
  private stepFrame = false;
  private footAccum = 0;
  /** Which floor the player walks on — scenes override (wood at home). */
  stepSound = 'sfx/step-tile';
  private keys: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key[]>;

  private shadow: Phaser.GameObjects.Ellipse;

  constructor(private scene: Phaser.Scene, x: number, y: number, private prefix = 'player') {
    this.shadow = scene.add.ellipse(x, y, 24, 8, 0x000000, 0.2);
    this.sprite = scene.physics.add.sprite(x, y, `${prefix}/idle-down`);
    this.sprite.setOrigin(0.5, 1);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(22, 12);
    body.setOffset((this.sprite.width - 22) / 2, this.sprite.height - 12);
    const kb = scene.input.keyboard!;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      up: [kb.addKey(K.UP), kb.addKey(K.W)],
      down: [kb.addKey(K.DOWN), kb.addKey(K.S)],
      left: [kb.addKey(K.LEFT), kb.addKey(K.A)],
      right: [kb.addKey(K.RIGHT), kb.addKey(K.D)],
    };
  }

  lock(): void {
    this.locked = true;
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    this.setTexture(`idle-${this.facing}`);
  }

  unlock(): void {
    this.locked = false;
  }

  get isLocked(): boolean {
    return this.locked;
  }

  /** Point one step ahead of the feet, for interaction probing. */
  facingPoint(dist = 26): Phaser.Math.Vector2 {
    const fx = this.facing === 'left' ? -dist : this.facing === 'right' ? dist : 0;
    const fy = this.facing === 'up' ? -dist : this.facing === 'down' ? dist : 0;
    return new Phaser.Math.Vector2(this.sprite.x + fx, this.sprite.y + fy);
  }

  private setTexture(frame: string): void {
    const key = `${this.prefix}/${frame}`;
    if (this.scene.textures.exists(key) && this.sprite.texture.key !== key) {
      this.sprite.setTexture(key);
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      body.setSize(22, 12);
      body.setOffset((this.sprite.width - 22) / 2, this.sprite.height - 12);
    }
  }

  update(_time: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.shadow.setPosition(this.sprite.x, this.sprite.y - 1).setDepth(this.sprite.y - 1);
    if (this.locked) {
      body.setVelocity(0, 0);
      this.sprite.setDepth(this.sprite.y);
      return;
    }
    const held = (dir: keyof typeof this.keys) => this.keys[dir].some((k) => k.isDown);
    let vx = 0;
    let vy = 0;
    if (held('left')) vx -= 1;
    if (held('right')) vx += 1;
    if (held('up')) vy -= 1;
    if (held('down')) vy += 1;
    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(SPEED);
      body.setVelocity(v.x, v.y);
      this.facing = Math.abs(vx) >= Math.abs(vy) ? (vx < 0 ? 'left' : 'right') : (vy < 0 ? 'up' : 'down');
      this.stepAccum += delta;
      if (this.stepAccum > STEP_MS) {
        this.stepAccum = 0;
        this.stepFrame = !this.stepFrame;
      }
      this.setTexture(`walk-${this.facing}-${this.stepFrame ? 'a' : 'b'}`);
      this.footAccum += delta;
      if (this.footAccum > FOOTSTEP_MS) {
        this.footAccum = 0;
        audio.sfx(this.stepSound, { volume: 0.16, rate: 0.9 + Math.random() * 0.2 });
      }
    } else {
      body.setVelocity(0, 0);
      this.stepAccum = STEP_MS;
      this.setTexture(`idle-${this.facing}`);
    }
    this.sprite.setDepth(this.sprite.y);
  }
}
