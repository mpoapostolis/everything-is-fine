import Phaser from 'phaser';
import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { corridorSegments } from '../engine/geometry';
import { StoryScene } from './StoryScene';

const S = EN.corridor;
const SEG_W = 160;

/** CHAPTERS 5–8 — THE CORRIDOR. You cannot find the doctor; he finds you,
 *  one dose per hour: a bit of a fever → a little oxygen → a LOT of blood.
 *  The corridor grows with every dose. In between, a nurse takes you to
 *  see the baby in the incubator. */
export class CorridorScene extends StoryScene {
  private phase = 0; // 0: fever pending · 1: oxygen+NICU · 2: blood → go home
  private exitX = 0; // >0 once the doctor says "go home" — walking onto the
  // glass doors leaves, checked here directly, independent of prompts
  private roomWidth = 0;

  constructor() {
    super('Corridor');
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    // Phase 2: the ENTIRE right end of the corridor is the way out.
    // Near the doors, or simply reaching the last strip — either leaves.
    // Open dialogue does not matter; goTo clears it. Nothing wedges this.
    if (this.phase === 2 && !this.leaving) {
      const p = this.player.sprite;
      const nearDoors = this.exitX > 0
        && Phaser.Math.Distance.Between(p.x, p.y, this.exitX, 92) < 58;
      const atTheEnd = this.roomWidth > 0 && p.x > this.roomWidth - 85;
      if (nearDoors || atTheEnd) {
        this.exitX = 0;
        this.setWaypoint(null);
        void this.goTo('HomeCall');
      }
    }
  }

  init(data: { phase?: number }): void {
    this.phase = data.phase ?? 0;
  }

  create(): void {
    this.setupWorld(120, 250);
    this.ui.setAmbience(0xaebccf, 0.16 + this.phase * 0.09); // colder every hour
    audio.setMusic('music/corridor', 0.22 + this.phase * 0.08);
    if (this.phase >= 1) {
      audio.setLayer('sfx/heartbeat', 0.06 + this.phase * 0.06); // your own pulse
    }

    const segments = corridorSegments(this.phase);
    const width = 200 + segments * SEG_W;
    const floorKey = this.phase >= 2 ? 'surface/hosp-floor-dim' : 'surface/hosp-floor';
    const wallKey = this.phase >= 2 ? 'surface/hosp-wall-dim' : 'surface/hosp-wall';
    const room = this.room.interior(0, 64, width, 200, floorKey, wallKey);
    this.roomWidth = width;
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    // her door — always at the left end. Always closed.
    this.room.door(70, 62, 'prop/door-double-wood', { solid: true });
    this.interactions.add({
      x: 40, y: 66, w: 60, h: 40, verb: 'Listen', once: false, promptY: 100,
      onUse: async () => {
        await this.play([{ say: { text: S.doorListen } }]);
      },
    });

    // dressing
    this.room.prop(180, 132, 'prop/chairs-row');
    this.room.wallDecal(258, 40, 'sign/wait-here');
    const clockDecal = this.room.wallDecal(340, 38, 'prop/wall-clock');
    if (this.phase >= 2) clockDecal.setAngle(4); // wrong time; nobody comments
    const pools: Phaser.GameObjects.Ellipse[] = [];
    for (let lx = 140; lx < width - 60; lx += 180) {
      pools.push(this.room.lightPool(lx, 150, 140, 60, 0xdfe8f0, 0.055));
    }
    if (this.phase >= 1) {
      // the fluorescents start to stutter — never all at once, never explained
      for (const pool of pools) {
        this.time.addEvent({
          delay: 2600 + Math.random() * 5200, loop: true,
          callback: () => {
            if (Math.random() < 0.45) {
              this.tweens.add({ targets: pool, alpha: 0.008, duration: 70, yoyo: true, repeat: 2 });
            }
          },
        });
      }
      // distant sounds from floors you cannot reach
      const distant = () => {
        if (Math.random() < 0.5) {
          audio.sfx('sfx/door-slam', { volume: 0.12, rate: 0.5 }); // a far-off door
        } else {
          audio.sfx('sfx/beep', { volume: 0.07, rate: 0.45 }); // a phone nobody answers
        }
        this.time.delayedCall(9_000 + Math.random() * 16_000, distant);
      };
      this.time.delayedCall(7_000, distant);
    }
    if (this.phase >= 2) {
      // the clock lies for half a second at a time. Nobody comments.
      const glitch = () => {
        if (!this.ui.busy) {
          this.ui.port.setClock(`TUE 13:0${Math.floor(Math.random() * 10)}`);
          this.time.delayedCall(420, () => this.ui.port.setClock('TUE 12:40'));
        }
        this.time.delayedCall(14_000 + Math.random() * 14_000, glitch);
      };
      this.time.delayedCall(9_000, glitch);
      // and the walls come slowly, slowly closer
      this.tweens.add({
        targets: this.cameras.main,
        zoom: this.cameras.main.zoom * 1.07,
        duration: 75_000,
        ease: 'sine.in',
      });
    }
    for (let px = 360; px < width - 100; px += 320) {
      this.room.wallDecal(px, 42, 'prop/wall-art');
      this.room.prop(px + 60, 128, 'prop/bin-grey');
    }
    this.room.prop(240, 260, 'prop/wet-floor', { solid: false });
    this.room.prop(width - 140, 130, 'prop/water-cooler');

    // locked doors, one per segment (the second-to-last is the wrong one)
    for (let i = 0; i < segments; i++) {
      const x = 420 + i * SEG_W;
      if (x > width - 80) break;
      if (this.phase >= 2 && x > width - 220) continue; // keep the exit corner clean
      const isWrongDoor = this.phase >= 2 && i === 1; // mid-corridor, far from the exit
      this.room.door(x, 62, isWrongDoor ? 'door/teal' : 'door/wood', { solid: true });
      if (isWrongDoor) {
        this.interactions.add({
          x: x - 26, y: 66, w: 52, h: 40, verb: "It isn't locked", once: true, promptY: 102,
          onUse: async () => {
            await this.play([
              { say: { text: S.wrongDoor1 } },
              { say: { text: S.wrongDoor2 } },
              { say: { text: S.wrongDoor3 } },
            ]);
          },
        });
      } else {
        this.room.wallDecal(x, 30, 'sign/access-denied');
        this.interactions.add({
          x: x - 26, y: 66, w: 52, h: 40, verb: 'Try the door', once: false, promptY: 102,
          onUse: async () => {
            await this.play([{ say: { text: S.staffOnly } }]);
          },
        });
      }
    }

    // phase setup
    const objective = [S.objWait, S.objWaitShort, S.objDots][this.phase];
    const clock = ['TUE 10:30', 'TUE 11:35', 'TUE 12:40'][this.phase];
    void this.playFree([{ objective }, { clock }]);

    if (this.phase === 2) {
      // the way out is real and visible: glass doors under the EXIT sign —
      // and it WORKS from second one, whatever dialogue is still open
      this.room.door(width - 60, 62, 'door/glass-double', { solid: true });
      this.room.wallDecal(width - 60, 24, 'sign/exit');
      this.exitX = width - 60;
    }
    // his voice first — the doses only start counting after it
    void (async () => {
      const thoughts = [S.thoughts0, S.thoughts1, S.thoughts2][this.phase] ?? [];
      await this.intro(thoughts);
      if (this.phase === 0) {
        this.time.delayedCall(12_000, () => void this.feverDose());
      } else if (this.phase === 1) {
        this.time.delayedCall(12_000, () => void this.oxygenDose());
      } else {
        this.time.delayedCall(1_200, () => void this.bloodDose(width));
      }
    })();

    // the phone: free-form despair, authored by the player
    this.input.keyboard!.removeListener('keydown-C');
    this.input.keyboard!.on('keydown-C', () => {
      if (this.ui.busy) return;
      audio.sfx('sfx/beep', { volume: 0.25, rate: 1.4 });
      window.setTimeout(() => audio.sfx('sfx/beep', { volume: 0.25, rate: 1.4 }), 380);
      void this.play([
        { say: { text: S.callRing } },
        { note: { time: ['10:4?', '11:5?', '12:5?'][this.phase], text: S.noteCall } },
      ]);
    });
    if (this.phase === 1) {
      this.time.delayedCall(4_000, () => {
        if (!this.ui.busy) void this.playFree([{ say: { text: S.callHint } }]);
      });
    }
  }

  /** The doctor appears next to you. You never find him — he finds you. */
  private async doctorComes(lines: Parameters<StoryScene['playFree']>[0]): Promise<void> {
    this.allowUnlock = false;
    this.player.lock();
    const p = this.player.sprite;
    const doctor = this.room.person(p.x + 44, p.y + 2, 'doctor/idle-left');
    await this.playFree(lines);
    doctor.destroy();
    this.allowUnlock = true;
  }

  private async feverDose(): Promise<void> {
    this.allowUnlock = false;
    this.player.lock();
    const p = this.player.sprite;
    const doctor = this.room.person(p.x + 44, p.y + 2, 'doctor/idle-left');
    await this.playFree([
      { say: { speaker: 'Doctor', text: S.doseFever1 } },
      { say: { text: S.feverRush } }, // this one is in a hurry
    ]);
    // rule five: the game's only choice. Both answers change nothing.
    await this.ui.choice([S.choiceOkay, S.choiceWhatOkay]);
    await this.playFree([
      { say: { speaker: 'Doctor', text: S.doseFever2 } },
      { say: { speaker: 'You', text: S.youSeeHer } },
      { say: { speaker: 'Doctor', text: S.docNotYet } },
      { note: { time: '10:45', text: S.noteFever } },
    ]);
    doctor.destroy();
    this.allowUnlock = true;
    await this.ui.timeCard('11:35', 1400, true); // stay black into the rebuild
    this.scene.restart({ phase: 1 });
  }

  private async oxygenDose(): Promise<void> {
    await this.doctorComes([
      { say: { speaker: 'Doctor', text: S.doseOxygen } },
      { say: { text: S.oxygenAwkward } }, // this one can't hold your eye
      { say: { speaker: 'You', text: S.youSerious } },
      { say: { speaker: 'Doctor', text: S.docPrecaution } },
      { note: { time: '11:50', text: S.noteOxygen } },
    ]);
    // a nurse appears — the one kindness: you can see the baby
    this.allowUnlock = false;
    this.player.lock();
    const p = this.player.sprite;
    const nurse = this.room.person(p.x - 44, p.y + 2, 'nurse/point');
    await this.playFree([{ say: { speaker: 'Nurse', text: S.nurseNicu } }]);
    nurse.destroy();
    await this.goTo('Nicu', 700);
  }

  private async bloodDose(width: number): Promise<void> {
    await this.doctorComes([
      { say: { speaker: 'Doctor', text: S.doseBlood1 } },
      { say: { speaker: 'Doctor', text: S.doseBlood2 } },
      { say: { speaker: 'You', text: S.youNotLeaving } },
      { say: { speaker: 'Doctor', text: S.docGo } },
      { say: { text: S.docGoKind } }, // this one means it. That's the worst part.
      { note: { time: '12:45', text: S.noteBlood } },
      { objective: S.objGoHome },
    ]);
    this.setWaypoint(width - 60, 82);
  }
}
