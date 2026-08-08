import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { gameState } from '../engine/GameState';
import { StoryScene } from './StoryScene';

const S = EN.waters;

/** CHAPTER 1, second half — HOME, MINUTES LATER. The waters break. */
export class WatersScene extends StoryScene {
  protected override stepSound = 'sfx/step-wood';

  constructor() {
    super('Waters');
  }

  create(): void {
    this.setupWorld(260, 240);
    void this.intro(S.thoughts);
    this.ui.setAmbience(0xa39cc0, 0.2); // noon, but the house has cooled
    audio.setMusic(null); // no music. The house is holding its breath.

    const room = this.room.interior(0, 64, 520, 260, 'surface/home-floor', 'surface/home-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    this.room.door(60, 62, 'home/door', { solid: true });
    this.room.wallDecal(100, 42, 'home/key-hook');
    this.room.wallDecal(230, 40, 'home/window');
    this.room.wallDecal(400, 40, 'home/window');
    this.room.wallDecal(320, 42, 'prop/wall-art');
    this.room.wallDecal(170, 38, 'prop/wall-clock-b');
    // the windows give cold evening light now — same house, different day
    this.room.lightPool(230, 110, 130, 60, 0xb8c4e0, 0.07);
    this.room.lightPool(400, 110, 130, 60, 0xb8c4e0, 0.07);
    this.add.image(66, 92, 'home/rug').setDepth(-9).setScale(0.5);
    this.room.prop(440, 116, 'home/kitchen-counter');
    this.add.image(414, 100, 'prop/water-bottle').setDepth(120).setScale(0.8);
    this.add.image(250, 190, 'home/rug').setDepth(-9);
    this.room.prop(250, 172, 'home/couch');
    this.room.prop(268, 250, 'home/table');
    this.add.image(456, 296, 'home/rug').setDepth(-9).setScale(0.8);
    this.room.prop(456, 300, 'home/crib');
    this.room.prop(505, 282, 'home/wardrobe');
    this.room.prop(456, 268, 'home/crib-mobile', { solid: false });
    this.add.image(466, 292, 'home/bear').setDepth(300);
    this.room.prop(116, 100, 'home/bag', { solid: false });
    this.room.prop(30, 104, 'home/car-seat-box');

    const wife = this.add.image(420, 200, 'wife/idle-down').setOrigin(0.5, 1);
    wife.setDepth(wife.y);

    void this.playFree([{ clock: 'MON 12:00' }, { objective: S.objGoToHer }]);
    this.setWaypoint(420, 200);

    this.interactions.add({
      x: 392, y: 156, w: 56, h: 50, verb: 'Something is wrong', once: true,
      onUse: async () => {
        await this.play([
          { say: { speaker: 'Wife', text: S.wifeFreeze } },
          { say: { speaker: 'Wife', text: S.wifeWaters } },
          { say: { speaker: 'You', text: S.youOkay } },
          // the call — two rings, then his voice
          { call: () => {
            audio.sfx('sfx/beep', { volume: 0.25, rate: 1.4 });
            window.setTimeout(() => audio.sfx('sfx/beep', { volume: 0.25, rate: 1.4 }), 380);
          } },
          { wait: 900 },
          { say: { speaker: 'Doctor (phone)', text: S.docPhone } },
          { say: { speaker: 'You', text: S.youComing } },
          // out of silence: the urgent pulse — everything changes here
          { call: () => audio.setMusic('music/waters', 0.42) },
          { flag: 'waters-broke' },
          { objective: S.objBack },
        ]);
        this.setWaypoint(100, 64); // keys. now.
      },
    });

    this.interactions.add({
      x: 80, y: 40, w: 60, h: 60, verb: 'Bag. Keys. Go.', promptY: 84, once: true,
      enabled: () => gameState.has('waters-broke'),
      onUse: async () => {
        this.setWaypoint(null);
        await this.play([{ say: { text: S.keys } }]);
        await this.goTo('Delivery');
      },
    });
  }
}
