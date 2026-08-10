import Phaser from 'phaser';
import { audio } from '../engine/audio';
import { gameState } from '../engine/GameState';
import { ScriptRunner } from '../engine/ScriptRunner';
import type { Step } from '../engine/types';
import { InteractionSystem } from '../world/Interactable';
import { PlayerController } from '../world/PlayerController';
import { RoomBuilder } from '../world/RoomBuilder';
import type { UiScene } from './UiScene';

/** Base for all chapter scenes: wires UI, player, rooms, interactions. */
export abstract class StoryScene extends Phaser.Scene {
  protected ui!: UiScene;
  protected runner!: ScriptRunner;
  protected room!: RoomBuilder;
  protected player!: PlayerController;
  protected interactions!: InteractionSystem;

  /** Camera zoom for story scenes — the world is small and close. */
  protected zoom = 2;

  /** Floor sound for this scene; home scenes override with wood. */
  protected stepSound = 'sfx/step-tile';

  private wpMark!: Phaser.GameObjects.Text;
  private wpTarget: Phaser.Math.Vector2 | null = null;

  /** Mark the current goal with a bobbing "!" right on the target. */
  protected setWaypoint(x: number | null, y = 0): void {
    if (x === null) {
      this.wpTarget = null;
      this.wpMark.setVisible(false);
      return;
    }
    this.wpTarget = new Phaser.Math.Vector2(x, y);
    this.wpMark.setPosition(x, y - 40).setVisible(true);
  }

  protected setupWorld(px: number, py: number): void {
    // Phaser REUSES scene instances across start()/restart() — every
    // transient flag must reset here, or a stale `leaving` from a previous
    // visit silently disables this scene's exits. (The corridor→NICU→corridor
    // round trip did exactly that.)
    this.leaving = false;
    this.allowUnlock = true;
    this.stuckMs = 0;
    this.ui = this.scene.get('Ui') as UiScene;
    this.scene.bringToTop('Ui');
    // no checkpoints, by design: every launch begins on Monday morning.
    // The story is meant to be lived whole.
    audio.setLayer(null); // scenes opt in to extra mood layers explicitly
    this.runner = new ScriptRunner({ state: gameState, notebook: this.ui.notebook, ui: this.ui.port });
    this.room = new RoomBuilder(this);
    this.player = new PlayerController(this, px, py);
    this.player.stepSound = this.stepSound;
    this.interactions = new InteractionSystem(this, () => this.ui.busy);
    this.physics.add.collider(this.player.sprite, this.room.solids);

    // the camera fills the whole window: zoom scales with the viewport.
    // Portrait phones prioritize WIDTH — otherwise the view becomes a slit.
    const applyZoom = () => {
      const w = this.scale.width;
      const h = this.scale.height;
      const z = h > w
        ? Math.max(w / 340, h / 560, 1.7)
        : Math.max(w / 560, h / 330, 2);
      this.cameras.main.setZoom(z);
    };
    applyZoom();
    const onResize = () => applyZoom();
    this.scale.on('resize', onResize);
    this.events.once('shutdown', () => this.scale.off('resize', onResize));

    // quest marker: a bobbing "!" on whatever needs you next
    // (positioned every frame in update() — a y-tween would pin it to the
    // first target's height forever)
    this.wpMark = this.add.text(0, 0, '!', {
      fontFamily: 'GameFont, monospace', fontSize: '18px', color: '#f0d284',
      stroke: '#211d12', strokeThickness: 4,
    }).setOrigin(0.5, 1).setDepth(951).setVisible(false);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
  }

  protected async play(steps: Step[]): Promise<void> {
    this.player.lock();
    await this.runner.run(steps);
    this.player.unlock();
  }

  /** Run steps without locking the player (ambient lines, objectives). */
  protected async playFree(steps: Step[]): Promise<void> {
    await this.runner.run(steps);
  }

  protected leaving = false;

  /** Scene entry: black screen → his inner voice, line by line → the world.
   *  The blackout is synchronous — not one frame of the world leaks through. */
  protected async intro(lines: ReadonlyArray<string>): Promise<void> {
    this.ui.blackout();
    await this.ui.innerVoice(lines);
    await this.ui.fadeIn(750);
  }

  protected async goTo(sceneKey: string, fadeMs = 700, data?: object): Promise<void> {
    if (this.leaving) return; // a second E during the fade must not double-fire
    this.leaving = true;
    this.allowUnlock = false;
    this.player.lock();
    this.ui.resetDialogue(); // half-finished conversations die at the door
    await this.ui.fadeOut(fadeMs);
    this.scene.start(sceneKey, data);
  }

  private stuckMs = 0;

  update(time: number, delta: number): void {
    if (this.ui.busy) {
      this.player.lock();
    } else if (this.player.isLocked && this.allowUnlock) {
      this.player.unlock();
    }
    // watchdog: whatever went wrong, the player is NEVER stranded frozen
    if (this.player.isLocked && !this.ui.busy && !this.leaving) {
      this.stuckMs += delta;
      if (this.stuckMs > 4000) {
        this.allowUnlock = true;
        this.player.unlock();
        this.stuckMs = 0;
      }
    } else {
      this.stuckMs = 0;
    }
    this.player.update(time, delta);
    this.interactions.update(this.player.facingPoint(), new Phaser.Math.Vector2(this.player.sprite.x, this.player.sprite.y - 4));

    if (this.wpTarget) {
      const p = this.player.sprite;
      const dist = Phaser.Math.Distance.Between(p.x, p.y, this.wpTarget.x, this.wpTarget.y);
      // hide the "!" once the player is at the spot (the [E] prompt takes over)
      this.wpMark.setVisible(dist > 60 && !this.ui.busy);
      this.wpMark.setPosition(
        this.wpTarget.x,
        this.wpTarget.y - 40 + Math.sin(time / 230) * 4,
      );
    }
  }

  /** Scenes set this false during scripted sequences so dialogue-close
   *  doesn't hand control back mid-cutscene. */
  protected allowUnlock = true;
}
