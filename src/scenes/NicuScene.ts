import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { StoryScene } from './StoryScene';

const S = EN.nicu;

/** CHAPTER 7 — THE BABY. Warm, dim, glass-filtered. The NICU staff are the
 *  only people in this hospital who explain things. */
export class NicuScene extends StoryScene {
  constructor() {
    super('Nicu');
  }

  create(): void {
    this.setupWorld(180, 220);
    this.ui.setAmbience(0xd8c4a8, 0.2); // the first warm light since home
    audio.setMusic('music/nicu', 0.26); // fragile, behind incubator glass
    audio.stopBeep();

    const room = this.room.interior(0, 64, 360, 180, 'surface/nicu-floor', 'surface/nicu-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    this.room.wallDecal(70, 40, 'sign/icu');
    this.room.lightPool(180, 150, 200, 90, 0xffdca8, 0.1);
    this.room.motes(180, 150, 170, 80, 0xffe0b0, 12); // the warm air is alive
    this.room.prop(180, 150, 'prop/incubator-cart');
    this.room.prop(70, 140, 'prop/monitor-cart');
    this.room.prop(290, 135, 'prop/drawer-cart');
    const nurse = this.room.person(300, 230, 'nicu-nurse/idle-down');
    void nurse;

    void (async () => {
      await this.intro(S.thoughts);
      await this.playFree([
        { clock: 'TUE 12:05' },
        { say: { text: S.scrub } }, // AUDIO: sfx-scrub-water when we have it
        { say: { speaker: 'NICU Nurse', text: S.nurse } },
        { say: { speaker: 'You', text: S.youWhenMum } },
        { say: { speaker: 'NICU Nurse', text: S.nurseMum } },
        { objective: '' },
      ]);
      this.setWaypoint(180, 150);
    })();

    this.interactions.add({
      x: 140, y: 110, w: 80, h: 60, verb: S.touch, once: true,
      onUse: async () => {
        this.setWaypoint(null);
        await this.play([
          { say: { text: S.touched } },
          { say: { speaker: 'You', text: S.whereIsShe } },
          { say: { speaker: 'NICU Nurse', text: S.nurseBack } },
        ]);
        this.setWaypoint(320, 260);
      },
    });

    this.interactions.add({
      x: 290, y: 230, w: 70, h: 50, verb: S.goBack, once: true,
      enabled: () => this.ui.notebook.entries().length > 0,
      onUse: async () => {
        await this.goTo('Corridor', 700, { phase: 2 });
      },
    });
  }
}
