import Phaser from 'phaser';
import { audio } from '../engine/audio';
import { Notebook } from '../engine/Notebook';
import { TouchControls } from '../ui/TouchControls';
import type { UiPort } from '../engine/types';
import { ClockHud } from '../ui/ClockHud';
import { DialogueBox } from '../ui/DialogueBox';
import { ObjectiveHud } from '../ui/ObjectiveHud';

/** Persistent overlay scene. Implements UiPort for scripts, owns the
 *  notebook, fade layer, ambience tint, controls bar and help panel.
 *  Everything tracks the live window size. */
export class UiScene extends Phaser.Scene {
  notebook = new Notebook();
  private dialogue!: DialogueBox;
  private objective!: ObjectiveHud;
  private clock!: ClockHud;
  private fadeRect!: Phaser.GameObjects.Rectangle;
  private notebookPanel?: Phaser.GameObjects.Container;
  private helpPanel?: Phaser.GameObjects.Container;
  private ambienceRect?: Phaser.GameObjects.Rectangle;
  private vignette?: Phaser.GameObjects.Graphics;
  private ambienceParams?: { tint: number; alpha: number };
  private controlsBar!: Phaser.GameObjects.Text;
  private barTop!: Phaser.GameObjects.Rectangle;
  private barBottom!: Phaser.GameObjects.Rectangle;
  private cineOn = false;

  constructor() {
    super('Ui');
  }

  create(): void {
    this.scene.bringToTop();
    this.dialogue = new DialogueBox(this);
    this.objective = new ObjectiveHud(this);
    this.clock = new ClockHud(this);
    this.fadeRect = this.add.rectangle(0, 0, 10, 10, 0x000000)
      .setOrigin(0).setDepth(2000).setAlpha(0);
    // cinematic letterbox — slides in whenever someone is speaking
    this.barTop = this.add.rectangle(0, 0, 10, 10, 0x05070b)
      .setOrigin(0, 1).setDepth(950);
    this.barBottom = this.add.rectangle(0, 0, 10, 10, 0x05070b)
      .setOrigin(0, 0).setDepth(950);
    this.controlsBar = this.add.text(0, 0,
      'E interact · N notebook · H help · F fullscreen', {
        fontFamily: 'GameFont, monospace', fontSize: '15px', color: '#4a5468',
      }).setOrigin(0.5, 1).setDepth(900);

    this.layout();
    this.scale.on('resize', () => this.layout());

    if (TouchControls.wanted()) {
      new TouchControls(this); // phones/tablets: joystick + E/N buttons
      this.controlsBar.setText('drag left side — walk · E — interact · N — notebook');
    }

    this.input.keyboard!.on('keydown-E', () => this.dialogue.advance());
    this.input.keyboard!.on('keydown-SPACE', () => this.dialogue.advance());
    this.input.keyboard!.on('keydown-N', () => this.toggleNotebook());
    this.input.keyboard!.on('keydown-H', () => this.toggleHelp());
    this.input.keyboard!.on('keydown-F', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  private layout(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.fadeRect.setSize(w, h);
    this.controlsBar.setPosition(w / 2, h - 8);
    const barH = Math.round(h * 0.085);
    this.barTop.setSize(w, barH).setPosition(0, this.cineOn ? barH : 0);
    this.barBottom.setSize(w, barH).setPosition(0, this.cineOn ? h - barH : h);
    if (this.ambienceParams) {
      this.drawAmbience();
    }
  }

  update(): void {
    const want = !!this.dialogue?.open;
    if (want !== this.cineOn) {
      this.cineOn = want;
      const h = this.scale.height;
      const barH = Math.round(h * 0.085);
      this.tweens.killTweensOf([this.barTop, this.barBottom]);
      this.tweens.add({
        targets: this.barTop, y: want ? barH : 0,
        duration: 420, ease: 'sine.out',
      });
      this.tweens.add({
        targets: this.barBottom, y: want ? h - barH : h,
        duration: 420, ease: 'sine.out',
      });
    }
  }

  private innerActive = false;
  private voiceGen = 0;
  private voiceTexts: Phaser.GameObjects.Text[] = [];
  private choiceActive = false;

  /** True while any modal UI is up — movement and interactions pause. */
  get busy(): boolean {
    if (!this.dialogue) return false; // queried before create() — nothing is up
    return this.dialogue.open || !!this.notebookPanel || !!this.helpPanel
      || this.innerActive || this.choiceActive;
  }

  /** A choice between answers. Whether it changes anything is the scene's
   *  business — rule five says exactly one of these exists, and it doesn't. */
  choice(options: string[]): Promise<number> {
    this.choiceActive = true;
    return new Promise((resolve) => {
      const w = Math.min(this.scale.width - 64, 620);
      const x = (this.scale.width - w) / 2;
      const y = this.scale.height - 200;
      const bg = this.add.rectangle(x, y, w, options.length * 40 + 24, 0x0d1016, 0.95)
        .setOrigin(0).setStrokeStyle(1, 0x39445a).setDepth(1100);
      const accent = this.add.rectangle(x, y, 3, options.length * 40 + 24, 0xe4c878, 0.95)
        .setOrigin(0).setDepth(1101);
      let idx = 0;
      const texts = options.map((opt, i) =>
        this.add.text(x + 26, y + 16 + i * 40, opt, {
          fontFamily: 'GameFont, monospace', fontSize: '22px', color: '#8fa3bf',
        }).setDepth(1101).setInteractive(),
      );
      const render = () => {
        texts.forEach((t, i) => {
          t.setColor(i === idx ? '#f0d284' : '#8fa3bf');
          t.setText((i === idx ? '▸ ' : '  ') + options[i]);
        });
      };
      render();
      const kb = this.input.keyboard!;
      const move = (d: number) => { idx = (idx + d + options.length) % options.length; render(); };
      const onUp = () => move(-1);
      const onDown = () => move(1);
      const finish = (picked: number) => {
        kb.off('keydown-UP', onUp); kb.off('keydown-W', onUp);
        kb.off('keydown-DOWN', onDown); kb.off('keydown-S', onDown);
        kb.off('keydown-E', onPick); kb.off('keydown-SPACE', onPick);
        bg.destroy(); accent.destroy(); texts.forEach((t) => t.destroy());
        this.choiceActive = false;
        resolve(picked);
      };
      const onPick = () => finish(idx);
      kb.on('keydown-UP', onUp); kb.on('keydown-W', onUp);
      kb.on('keydown-DOWN', onDown); kb.on('keydown-S', onDown);
      // small delay so the E that closed the previous line can't instapick
      this.time.delayedCall(250, () => {
        kb.on('keydown-E', onPick);
        kb.on('keydown-SPACE', onPick);
        texts.forEach((t, i) => t.on('pointerdown', () => finish(i)));
      });
    });
  }

  /** His voice, over black, between the scenes. One line at a time;
   *  E / Space / tap moves on. A newer voice always silences an older one —
   *  scene transitions can never stack two monologues. */
  async innerVoice(lines: ReadonlyArray<string>): Promise<void> {
    if (!lines.length) return;
    const g = ++this.voiceGen;
    for (const o of this.voiceTexts) o.destroy();
    this.voiceTexts = [];
    this.innerActive = true;
    for (const line of lines) {
      if (g !== this.voiceGen) return; // superseded by a newer scene's voice
      const t = this.add.text(this.scale.width / 2, this.scale.height / 2, line, {
        fontFamily: 'GameFont, monospace', fontSize: '26px', fontStyle: 'italic',
        color: '#b9c2d0', align: 'center',
        wordWrap: { width: Math.min(this.scale.width - 120, 720) },
        lineSpacing: 8,
      }).setOrigin(0.5).setDepth(2050).setAlpha(0);
      const hint = this.add.text(this.scale.width / 2, this.scale.height / 2 + 60, '▾', {
        fontFamily: 'GameFont, monospace', fontSize: '17px', color: '#3e4658',
      }).setOrigin(0.5).setDepth(2050).setAlpha(0);
      this.voiceTexts = [t, hint];
      await new Promise<void>((res) => {
        this.tweens.add({ targets: t, alpha: 1, duration: 550, onComplete: () => res() });
      });
      this.tweens.add({ targets: hint, alpha: 0.8, duration: 400, delay: 500 });
      await this.waitAdvance();
      if (g !== this.voiceGen) return; // superseded while waiting
      await new Promise<void>((res) => {
        this.tweens.add({
          targets: [t, hint], alpha: 0, duration: 280,
          onComplete: () => { t.destroy(); hint.destroy(); res(); },
        });
      });
    }
    if (g === this.voiceGen) {
      this.innerActive = false;
      this.voiceTexts = [];
    }
  }

  private waitAdvance(): Promise<void> {
    return new Promise((res) => {
      const done = () => {
        this.input.keyboard!.off('keydown-E', done);
        this.input.keyboard!.off('keydown-SPACE', done);
        this.input.off('pointerdown', done);
        res();
      };
      this.input.keyboard!.once('keydown-E', done);
      this.input.keyboard!.once('keydown-SPACE', done);
      this.input.once('pointerdown', done);
    });
  }

  // ---- UiPort ------------------------------------------------------------
  port: UiPort = {
    say: (speaker, text) => this.dialogue.say(speaker, text),
    setObjective: (t) => this.objective.set(t),
    setClock: (t) => this.clock.set(t),
  };

  /** Scene mood: multiply-tint + vignette over the world, under the HUD. */
  setAmbience(tint: number, alpha: number): void {
    this.ambienceParams = { tint, alpha };
    this.drawAmbience();
  }

  private drawAmbience(): void {
    const { tint, alpha } = this.ambienceParams!;
    const w = this.scale.width;
    const h = this.scale.height;
    this.ambienceRect?.destroy();
    this.vignette?.destroy();
    this.ambienceRect = this.add.rectangle(0, 0, w, h, tint, alpha)
      .setOrigin(0).setDepth(500).setBlendMode(Phaser.BlendModes.MULTIPLY);
    const g = this.add.graphics().setDepth(501);
    const bandH = Math.round(h * 0.09);
    for (let i = 0; i < 20; i++) {
      g.fillStyle(0x000000, 0.014 * (20 - i));
      g.fillRect(0, (i * bandH) / 20, w, bandH / 20);
      g.fillRect(0, h - ((i + 1) * bandH) / 20, w, bandH / 20);
    }
    this.vignette = g;
  }

  // ---- transitions -------------------------------------------------------
  /** Hard cut to black, same tick — no tween, no flash frame. */
  blackout(): void {
    this.tweens.killTweensOf(this.fadeRect);
    this.fadeRect.setAlpha(1);
  }

  /** Scene transitions call this: any open/queued dialogue dies here. */
  resetDialogue(): void {
    this.dialogue?.reset();
    this.voiceGen++;
    for (const o of this.voiceTexts) o.destroy();
    this.voiceTexts = [];
    this.innerActive = false;
  }

  async fadeOut(ms = 600): Promise<void> {
    await new Promise<void>((res) => {
      this.tweens.add({ targets: this.fadeRect, alpha: 1, duration: ms, onComplete: () => res() });
    });
  }

  async fadeIn(ms = 600): Promise<void> {
    await new Promise<void>((res) => {
      this.tweens.add({ targets: this.fadeRect, alpha: 0, duration: ms, onComplete: () => res() });
    });
  }

  /** Full-screen time card: "23:52", held on black, then back to the world.
   *  `stayBlack` keeps the screen dark afterwards — for cards that lead
   *  straight into a scene change (no flash of the old world). */
  async timeCard(text: string, holdMs = 1600, stayBlack = false): Promise<void> {
    await this.fadeOut(500);
    const card = this.add.text(this.scale.width / 2, this.scale.height / 2, text, {
      fontFamily: 'GameFont, monospace',
      fontSize: text.length > 14 ? '30px' : '46px',
      color: '#c8d0dc',
      align: 'center',
      wordWrap: { width: this.scale.width - 140 },
      lineSpacing: 10,
    }).setOrigin(0.5).setDepth(2001).setAlpha(0);
    await new Promise<void>((res) => {
      this.tweens.add({ targets: card, alpha: 1, duration: 350, onComplete: () => res() });
    });
    await new Promise((r) => this.time.delayedCall(holdMs, r));
    await new Promise<void>((res) => {
      this.tweens.add({ targets: card, alpha: 0, duration: 350, onComplete: () => { card.destroy(); res(); } });
    });
    if (!stayBlack) {
      await this.fadeIn(400); // a card must never strand the player in black
    }
  }

  // ---- notebook ----------------------------------------------------------
  private toggleNotebook(): void {
    if (this.notebookPanel) {
      this.notebookPanel.destroy();
      this.notebookPanel = undefined;
      return;
    }
    if (this.dialogue.open || this.helpPanel) return;
    audio.sfx('sfx/paper', { volume: 0.35 });
    const w = Math.min(480, this.scale.width - 60);
    const h = this.scale.height - 90;
    const entries = this.notebook.entries();
    const lines = entries.length
      ? entries.map((e) => `${e.time}  ${e.text}`).join('\n\n')
      : '(nothing written yet)';
    const bg = this.add.rectangle(0, 0, w, h, 0x0d1016, 0.97).setOrigin(0);
    bg.setStrokeStyle(1, 0x39445a);
    const accent = this.add.rectangle(0, 0, 3, h, 0xe4c878, 0.9).setOrigin(0);
    const title = this.add.text(18, 14, 'NOTEBOOK — what they told you', {
      fontFamily: 'GameFont, monospace', fontSize: '16px', color: '#8fa3bf',
    });
    const body = this.add.text(18, 42, lines, {
      fontFamily: 'GameFont, monospace', fontSize: '19px', color: '#c8cfc2',
      wordWrap: { width: w - 36 }, lineSpacing: 4,
    });
    const closeHint = this.add.text(w - 14, h - 10, 'N to close', {
      fontFamily: 'GameFont, monospace', fontSize: '15px', color: '#4a5468',
    }).setOrigin(1);
    this.notebookPanel = this.add
      .container(this.scale.width - w - 28, 44, [bg, accent, title, body, closeHint])
      .setDepth(1500);
  }

  // ---- help --------------------------------------------------------------
  private toggleHelp(): void {
    if (this.helpPanel) {
      this.helpPanel.destroy();
      this.helpPanel = undefined;
      return;
    }
    if (this.dialogue.open || this.notebookPanel) return;
    const w = 440;
    const lines = [
      ['ARROWS / WASD', 'walk'],
      ['E', 'interact · advance dialogue'],
      ['SPACE', 'advance dialogue'],
      ['N', 'notebook — every quote they told you, with the time. Read it. Compare.'],
      ['C', 'call her (when you have your phone out, in the corridor)'],
      ['F', 'fullscreen on/off'],
      ['H', 'this panel'],
    ];
    const body = lines.map(([k, v]) => `${k.padEnd(14)} ${v}`).join('\n\n');
    const bodyText = this.add.text(18, 46, body, {
      fontFamily: 'GameFont, monospace', fontSize: '18px', color: '#c8d0dc',
      wordWrap: { width: w - 36 }, lineSpacing: 4,
    });
    const h = bodyText.height + 76;
    const bg = this.add.rectangle(0, 0, w, h, 0x0d1016, 0.97).setOrigin(0)
      .setStrokeStyle(1, 0x39445a);
    const accent = this.add.rectangle(0, 0, 3, h, 0x8fa3bf, 0.9).setOrigin(0);
    const title = this.add.text(18, 14, 'HOW TO PLAY', {
      fontFamily: 'GameFont, monospace', fontSize: '16px', color: '#8fa3bf',
    });
    this.helpPanel = this.add
      .container((this.scale.width - w) / 2, (this.scale.height - h) / 2, [bg, accent, title, bodyText])
      .setDepth(1600);
  }
}
