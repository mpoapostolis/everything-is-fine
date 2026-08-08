import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { gameState } from '../engine/GameState';
import { StoryScene } from './StoryScene';

const S = EN.checkup;

/** CHAPTER 1 — THE CHECK-UP. Bright, busy, absolutely normal. */
export class CheckupScene extends StoryScene {
  constructor() {
    super('Checkup');
  }

  create(): void {
    this.setupWorld(320, 280);
    void this.intro(S.thoughts);
    this.ui.setAmbience(0xd4deea, 0.13); // daylight hospital — still friendly
    audio.setMusic('music/checkup', 0.28); // an ordinary, busy, harmless day

    const room = this.room.interior(0, 64, 640, 240, 'surface/hosp-floor', 'surface/hosp-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    // wall dressing
    this.room.wallDecal(120, 40, 'sign/ward-a');
    this.room.wallDecal(330, 38, 'prop/wall-clock');
    this.room.wallDecal(230, 42, 'prop/wall-art');
    this.room.wallDecal(490, 42, 'prop/wall-art');
    this.room.door(560, 62, 'door/elevator', { solid: true });
    this.room.door(430, 62, 'door/teal', { solid: true });
    // the way in — and out: glass doors under the EXIT sign
    this.room.door(56, 62, 'door/glass-double', { solid: true });
    this.room.wallDecal(56, 24, 'sign/exit');
    // fluorescent pools, evenly spaced — institutional rhythm
    for (const lx of [120, 320, 520]) {
      this.room.lightPool(lx, 150, 150, 70, 0xdfe8f0, 0.06);
    }

    // reception + waiting
    this.room.prop(150, 150, 'receptionist/desk-a');
    this.room.prop(280, 128, 'prop/chairs-row');
    this.room.prop(360, 128, 'prop/side-table');
    this.room.prop(90, 250, 'prop/water-cooler');
    this.room.prop(50, 130, 'prop/bin-grey');
    this.room.prop(620, 250, 'prop/bin-green');
    this.room.person(300, 118, 'nurse2/idle-down');

    // exam corner (right)
    this.room.prop(520, 170, 'prop/bed-green');
    this.room.prop(610, 150, 'prop/monitor-cart');
    const ob = this.add.image(545, 235, 'doctor/idle-down').setOrigin(0.5, 1);
    ob.setDepth(ob.y);
    const wife = this.add.image(480, 240, 'wife/idle-right').setOrigin(0.5, 1);
    wife.setDepth(wife.y);

    void this.playFree([{ clock: 'MON 09:00' }, { objective: S.objFind }]);
    this.setWaypoint(545, 215); // the exam corner

    this.interactions.add({
      x: 120, y: 120, w: 70, h: 50, verb: 'Ask', once: false,
      onUse: async () => {
        await this.play([{ say: { speaker: 'Receptionist', text: S.receptionist } }]);
      },
    });

    this.interactions.add({
      x: 515, y: 195, w: 64, h: 50, verb: 'The check-up', once: true,
      onUse: async () => {
        await this.play([
          { say: { speaker: 'OB', text: S.obUp } },
          { say: { text: S.obGel } },
          { say: { speaker: 'OB', text: S.obHeart } },
          { say: { speaker: 'OB', text: S.obLine } },
          { say: { speaker: 'OB', text: S.obLine2 } },
          { say: { speaker: 'Wife', text: S.wifeTold } },
          { note: { time: '09:10', text: S.obNote } },
          { flag: 'checkup-done' },
          { objective: S.objHome },
        ]);
        this.setWaypoint(56, 82); // the glass doors, under the EXIT sign
      },
    });

    // the door ALWAYS answers — silence is how players get stranded
    let nagUntil = 0;
    let leftForHome = false;
    this.interactions.add({
      x: 16, y: 66, w: 80, h: 56, verb: 'Go home', promptY: 104, auto: true,
      onUse: async () => {
        if (leftForHome) return;
        if (!gameState.has('checkup-done')) {
          if (this.time.now < nagUntil) return;
          nagUntil = this.time.now + 5000;
          await this.play([{ say: { text: S.exitNotYet } }]);
          this.setWaypoint(545, 215); // the exam corner — she's waiting
          return;
        }
        leftForHome = true;
        this.setWaypoint(null);
        await this.goTo('Waters');
      },
    });
  }
}
