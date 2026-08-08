import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { gameState } from '../engine/GameState';
import { StoryScene } from './StoryScene';

const S = EN.prologue;

/** PROLOGUE — HOME. Morning. Tutorial of tenderness. */
export class PrologueScene extends StoryScene {
  protected override stepSound = 'sfx/step-wood';
  private dogLine = 0;
  private wifeLine = 0;

  constructor() {
    super('Prologue');
  }

  create(): void {
    this.setupWorld(260, 220);
    void this.intro(S.thoughts);
    this.ui.setAmbience(0xf2ddb8, 0.1); // morning warmth
    audio.setMusic('music/prologue', 0.3); // warm, unhurried — the last easy morning

    const room = this.room.interior(0, 64, 520, 260, 'surface/home-floor', 'surface/home-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    // wall dressing
    this.room.door(60, 62, 'home/door', { solid: true }); // front door
    this.room.wallDecal(100, 42, 'home/key-hook');
    this.room.wallDecal(230, 40, 'home/window');
    this.room.wallDecal(400, 40, 'home/window');
    this.room.wallDecal(320, 42, 'prop/wall-art');
    this.room.wallDecal(170, 38, 'prop/wall-clock-b');
    // morning light through the windows — with dust drifting in it
    this.room.lightPool(230, 110, 130, 60, 0xffe9c0, 0.1);
    this.room.lightPool(400, 110, 130, 60, 0xffe9c0, 0.1);
    this.room.motes(230, 115, 120, 60);
    this.room.motes(400, 115, 120, 60);
    this.add.image(66, 92, 'home/rug').setDepth(-9).setScale(0.5); // doormat

    // kitchen right
    this.room.prop(440, 116, 'home/kitchen-counter');
    this.add.image(414, 100, 'prop/water-bottle').setDepth(120).setScale(0.8);
    this.add.image(468, 99, 'prop/tissues').setDepth(120).setScale(0.7);
    // living centre
    this.add.image(250, 190, 'home/rug').setDepth(-9);
    this.room.prop(250, 172, 'home/couch');
    this.room.prop(268, 250, 'home/table');
    this.room.prop(160, 116, 'home/tv-stand');
    // nursery corner — its own little island of light
    this.add.image(456, 296, 'home/rug').setDepth(-9).setScale(0.8);
    this.room.lightPool(456, 296, 120, 70, 0xffe0b8, 0.09);
    this.room.prop(456, 300, 'home/crib');
    this.room.prop(505, 282, 'home/wardrobe');
    // by the door
    this.room.prop(116, 100, 'home/bag', { solid: false });
    this.room.prop(30, 104, 'home/car-seat-box');
    this.room.prop(150, 310, 'home/dog-bed', { solid: false });

    const dog = this.add.image(151, 300, 'home/dog-lying').setOrigin(0.5, 1).setDepth(320);
    this.tweens.add({ targets: dog, scaleY: 1.06, duration: 1600, yoyo: true, repeat: -1, ease: 'sine.inout' }); // breathing

    const wife = this.add.image(320, 210, 'wife/idle-down-c').setOrigin(0.5, 1);
    wife.setDepth(wife.y);

    void this.playFree([{ clock: 'MON 08:10' }, { objective: S.objMobile }]);
    this.setWaypoint(456, 290); // the crib

    // --- interactions ------------------------------------------------------
    this.interactions.add({
      x: 130, y: 285, w: 50, h: 40, verb: 'Pet Karma', once: false,
      onUse: async () => {
        await this.play([{ say: { text: S.dog[this.dogLine++ % S.dog.length] } }]);
      },
    });
    this.interactions.add({
      x: 410, y: 84, w: 80, h: 44, verb: 'Drink some water', once: true,
      onUse: async () => {
        await this.play([{ say: { text: S.water } }]);
      },
    });
    this.interactions.add({
      x: 296, y: 172, w: 50, h: 46, verb: 'Talk to her', once: false,
      onUse: async () => {
        const line = this.wifeLine++ % 2 === 0 ? S.wifeTalk1 : S.wifeTalk2;
        await this.play([{ say: { speaker: 'Wife', text: line } }]);
      },
    });
    this.interactions.add({
      x: 10, y: 76, w: 44, h: 40, verb: 'Open the box?', once: true,
      onUse: async () => {
        await this.play([
          { say: { text: S.boxTry } },
          { say: { speaker: 'Wife', text: S.wifeBox } },
          { flag: 'box-left-behind' },
        ]);
      },
    });

    // nursery: three steps, in order
    this.interactions.add({
      x: 428, y: 262, w: 60, h: 50, verb: 'Hang the mobile',
      enabled: () => !gameState.has('mobile-hung'),
      onUse: async () => {
        await this.play([{ say: { text: S.mobileHang } }, { flag: 'mobile-hung' }, { objective: S.objBear }]);
        this.room.prop(456, 268, 'home/crib-mobile', { solid: false });
      },
    });
    this.interactions.add({
      x: 428, y: 262, w: 60, h: 50, verb: 'Put the bear in',
      enabled: () => gameState.has('mobile-hung') && !gameState.has('bear-placed'),
      onUse: async () => {
        await this.play([{ say: { text: S.bearPlace } }, { flag: 'bear-placed' }, { objective: S.objOnesie }]);
        this.add.image(466, 292, 'home/bear').setDepth(300);
        this.setWaypoint(116, 90); // the hospital bag by the door
      },
    });
    this.interactions.add({
      x: 428, y: 262, w: 60, h: 50, verb: 'Look',
      enabled: () => gameState.has('bear-placed'),
      onUse: async () => {
        await this.play([{ say: { text: S.cribLook } }]);
      },
    });
    this.interactions.add({
      x: 96, y: 78, w: 44, h: 40, verb: 'Fold the onesie in',
      enabled: () => gameState.has('bear-placed') && !gameState.has('bag-ready'),
      onUse: async () => {
        await this.play([
          { say: { text: S.onesie } },
          { say: { text: S.bagCheck } },
          { flag: 'bag-ready' },
          { objective: S.objDrive },
        ]);
        this.setWaypoint(100, 64); // the keys on the hook
      },
    });
    this.interactions.add({
      x: 80, y: 40, w: 44, h: 44, verb: 'Take the keys', promptY: 80, once: true,
      enabled: () => gameState.has('bag-ready'),
      onUse: async () => {
        this.setWaypoint(null);
        audio.sfx('sfx/switch', { volume: 0.35 });
        await this.play([{ say: { text: S.keys } }, { flag: 'keys-taken' }]);
        audio.sfx('sfx/door-close', { volume: 0.4 });
        await this.goTo('Checkup');
      },
    });
  }
}
