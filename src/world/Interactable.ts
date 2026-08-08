import Phaser from 'phaser';
import { InteractPrompt } from '../ui/InteractPrompt';

export interface InteractableConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Verb shown in the prompt: "Look", "Hold her hand"… */
  verb: string;
  /** Where the [E] prompt floats (defaults to zone top-center). */
  promptY?: number;
  once?: boolean;
  /** Fires by simply walking into it — for exit doors. No E required. */
  auto?: boolean;
  enabled?: () => boolean;
  onUse: () => void | Promise<void>;
}

export class Interactable {
  used = false;
  constructor(public cfg: InteractableConfig) {}

  get active(): boolean {
    if (this.used && this.cfg.once) return false;
    return this.cfg.enabled ? this.cfg.enabled() : true;
  }

  contains(p: Phaser.Math.Vector2): boolean {
    const { x, y, w, h } = this.cfg;
    return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
  }

  /** Forgiving reach: distance from the zone's centre. Standing roughly
   *  near a thing is enough — precision is not the game here. */
  nearCentre(p: Phaser.Math.Vector2, radius: number): boolean {
    const { x, y, w, h } = this.cfg;
    return Phaser.Math.Distance.Between(p.x, p.y, x + w / 2, y + h / 2) < radius;
  }
}

/** Scene-level registry: probes the tile ahead of the player, drives the
 *  prompt, fires the nearest interactable on E. */
export class InteractionSystem {
  private items: Interactable[] = [];
  private prompt: InteractPrompt;
  private eKey: Phaser.Input.Keyboard.Key;
  private firing = false;
  private cooldownUntil = 0;

  constructor(
    private scene: Phaser.Scene,
    private isBusy: () => boolean,
  ) {
    this.prompt = new InteractPrompt(scene);
    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  add(cfg: InteractableConfig): Interactable {
    const item = new Interactable(cfg);
    this.items.push(item);
    return item;
  }

  remove(item: Interactable): void {
    this.items = this.items.filter((i) => i !== item);
  }

  update(probe: Phaser.Math.Vector2, feet: Phaser.Math.Vector2): void {
    if (this.isBusy() || this.firing) {
      // the E that dismisses a dialogue must never also fire an interaction
      this.cooldownUntil = this.scene.time.now + 250;
      this.prompt.hide();
      return;
    }
    // exits (auto) always win over anything standing next to them
    const autoHit = this.items.find((i) => i.active && i.cfg.auto && i.nearCentre(feet, 40));
    const hit =
      autoHit ??
      this.items.find((i) => i.active && (i.contains(probe) || i.contains(feet))) ??
      this.items.find((i) => i.active && i.nearCentre(feet, 52));
    if (!hit) {
      this.prompt.hide();
      return;
    }
    const fire = () => {
      hit.used = true;
      const result = hit.cfg.onUse();
      if (result instanceof Promise) {
        this.firing = true;
        void result.finally(() => {
          this.firing = false;
        });
      }
    };
    // exit doors: walking into them is enough
    if (hit.cfg.auto && hit.nearCentre(feet, 34)) {
      this.prompt.hide();
      fire();
      return;
    }
    const { x, y, w } = hit.cfg;
    this.prompt.showAt(x + w / 2, (hit.cfg.promptY ?? y) - 6, hit.cfg.verb);
    if (this.scene.time.now < this.cooldownUntil) {
      Phaser.Input.Keyboard.JustDown(this.eKey); // swallow the stale press
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      fire();
    }
  }
}
