import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { StoryScene } from './StoryScene';

const S = EN.homecall;

/** CHAPTER 8 — HOME, ALONE. He said go rest. The phone has other plans. */
export class HomeCallScene extends StoryScene {
  protected override stepSound = 'sfx/step-wood';
  private phoneRinging = false;
  private callAnswered = false;

  constructor() {
    super('HomeCall');
  }

  create(): void {
    this.setupWorld(260, 240);
    this.ui.setAmbience(0x9c94ae, 0.24); // the house without her in it
    audio.setMusic(null); // silence. the house is a museum of yesterday.

    const room = this.room.interior(0, 64, 520, 260, 'surface/home-floor', 'surface/home-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    this.room.door(60, 62, 'home/door', { solid: true });
    this.room.wallDecal(100, 42, 'home/key-hook');
    this.room.wallDecal(230, 40, 'home/window');
    this.room.wallDecal(400, 40, 'home/window');
    this.room.wallDecal(170, 38, 'prop/wall-clock-b');
    this.add.image(66, 92, 'home/rug').setDepth(-9).setScale(0.5);
    this.room.prop(440, 116, 'home/kitchen-counter');
    this.add.image(250, 190, 'home/rug').setDepth(-9);
    this.room.prop(250, 172, 'home/couch');
    this.room.prop(268, 250, 'home/table');
    this.add.image(456, 296, 'home/rug').setDepth(-9).setScale(0.8);
    this.room.prop(456, 300, 'home/crib');
    this.room.prop(456, 268, 'home/crib-mobile', { solid: false });
    this.add.image(466, 292, 'home/bear').setDepth(300);
    this.room.prop(30, 104, 'home/car-seat-box');
    // the dog is here. It keeps checking the door.
    const dog = this.add.image(120, 120, 'home/dog').setDepth(120);
    this.tweens.add({ targets: dog, x: 150, duration: 3200, yoyo: true, repeat: -1, ease: 'sine.inout' });

    // an empty house is never silent — wood settles, somewhere
    const settle = () => {
      audio.sfx('sfx/step-wood', { volume: 0.09, rate: 0.4 + Math.random() * 0.15 });
      this.time.delayedCall(8_000 + Math.random() * 12_000, settle);
    };
    this.time.delayedCall(6_000, settle);

    void (async () => {
      await this.intro(S.thoughts);
      await this.playFree([
        { clock: 'TUE 13:40' },
        { objective: S.objRest },
        { say: { text: S.emptyHouse } },
      ]);
      this.armPhone();
    })();
  }

  // the call comes before rest does
  private armPhone(): void {
    this.time.delayedCall(9_000, () => {
      this.phoneRinging = true;
      const ring = () => {
        if (!this.phoneRinging) return;
        audio.sfx('sfx/beep', { volume: 0.3, rate: 0.7 });
        window.setTimeout(() => audio.sfx('sfx/beep', { volume: 0.3, rate: 0.7 }), 350);
      };
      ring();
      this.time.addEvent({ delay: 2200, repeat: 8, callback: ring });
      void this.playFree([{ objective: S.ringing }]);
      this.setWaypoint(268, 240); // your phone, on the table
    });

    this.interactions.add({
      x: 238, y: 210, w: 60, h: 50, verb: 'Answer',
      enabled: () => this.phoneRinging,
      onUse: async () => {
        this.phoneRinging = false;
        this.callAnswered = true;
        this.setWaypoint(null);
        await this.play([
          { say: { speaker: 'Doctor', text: S.docCall1 } },
          { say: { speaker: 'You', text: S.playerWhat } },
          { say: { speaker: 'Doctor', text: S.docCall2 } },
          { note: { time: '13:55', text: S.noteCall } },
          { call: () => audio.setMusic('music/waters', 0.45) },
          { objective: S.objTurnAround },
        ]);
        this.setWaypoint(100, 64);
      },
    });

    let leftForHospital = false;
    this.interactions.add({
      x: 80, y: 40, w: 44, h: 44, verb: S.keys, promptY: 80,
      onUse: async () => {
        if (leftForHospital) return;
        if (!this.callAnswered) {
          if (this.phoneRinging) {
            await this.play([{ say: { text: S.keysNotYet } }]);
            this.setWaypoint(268, 240);
          }
          return;
        }
        leftForHospital = true;
        this.setWaypoint(null);
        audio.sfx('sfx/door-slam', { volume: 0.5 });
        await this.goTo('Signature');
      },
    });
  }
}
