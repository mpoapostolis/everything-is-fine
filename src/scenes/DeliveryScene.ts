import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { StoryScene } from './StoryScene';

const S = EN.delivery;

/** CHAPTERS 2–4 — ADMISSION, THE LONG NIGHT (compressed), THE DOOR.
 *  The player learns to help. Then the door closes on them. */
export class DeliveryScene extends StoryScene {
  private acts = 0;
  private phase = 0; // 0 evening → 1 night → 2 deep night → 3 birth
  private waterLine = 0;
  private handLine = 0;
  private talkLine = 0;
  private nurseLine = 0;

  constructor() {
    super('Delivery');
  }

  create(): void {
    this.setupWorld(300, 250);
    this.ui.setAmbience(0xdccfb8, 0.14);
    audio.setMusic('music/delivery', 0.2); // the long night has its own music
    audio.startBeep(0.1); // the CTG. It will not stop until the door does.

    const room = this.room.interior(0, 64, 420, 220, 'surface/delivery-floor', 'surface/delivery-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    this.room.door(330, 62, 'prop/door-double-wood', { solid: true });
    this.room.wallDecal(120, 38, 'prop/wall-clock');
    this.room.wallDecal(200, 40, 'prop/monitor-ecg');
    this.room.lightPool(140, 175, 160, 80, 0xffe8cc, 0.08); // the light is hers
    this.room.prop(140, 170, 'wife/in-bed');
    this.room.prop(60, 130, 'prop/monitor-cart');
    this.room.prop(215, 130, 'prop/iv-stand');
    this.room.prop(230, 190, 'prop/stool');
    this.room.prop(285, 130, 'prop/drawer-cart');
    this.room.prop(60, 235, 'prop/side-table');
    this.add.image(60, 218, 'prop/med-bottles').setDepth(236).setScale(0.8);
    this.add.image(80, 220, 'prop/tissues').setDepth(236).setScale(0.7);
    const nurse = this.add.image(330, 130, 'nurse/idle-down').setOrigin(0.5, 1);
    nurse.setDepth(nurse.y);

    const doctor = this.add.image(300, 240, 'doctor/idle-down').setOrigin(0.5, 1);
    doctor.setDepth(doctor.y);

    void (async () => {
      await this.intro(S.thoughts);
      await this.play([
        { clock: 'MON 13:20' }, // Monday, early afternoon. It will be Tuesday before this ends.
        { say: { speaker: 'Doctor', text: S.docAsk1 } },
        { say: { speaker: 'You', text: S.youNoon } },
        { say: { speaker: 'Doctor', text: S.docAsk2 } },
        { say: { speaker: 'You', text: S.youClear } },
        { say: { speaker: 'Doctor', text: S.docCheck } },
        { wait: 900 },
        { say: { text: S.examBeat } }, // what this was, exactly, is never named
        { say: { speaker: 'Doctor', text: S.docEarly } },
        { say: { speaker: 'Doctor', text: S.docStay } },
        { say: { speaker: 'Doctor', text: S.docEarlier } },
        { say: { speaker: 'You', text: S.youWorried } },
        { say: { speaker: 'Doctor', text: S.doctor3 } },
        { note: { time: '13:20', text: S.note1943 } },
        { objective: S.objBeThere },
      ]);
      doctor.destroy(); // he leaves. You never find him — he finds you.
      this.setWaypoint(145, 185); // her. Always her.
    })();

    // --- the helping verbs -------------------------------------------------
    const bedZone = { x: 100, y: 160, w: 90, h: 60 };
    this.interactions.add({
      ...bedZone, verb: 'Hold her hand', once: false,
      onUse: async () => {
        await this.play([{ say: { text: S.hand[this.handLine++ % S.hand.length] } }]);
        await this.milestone();
      },
    });
    this.interactions.add({
      x: 196, y: 160, w: 40, h: 50, verb: 'Give her water', once: false,
      onUse: async () => {
        await this.play([{ say: { text: S.water[this.waterLine++ % S.water.length] } }]);
        await this.milestone();
      },
    });
    this.interactions.add({
      x: 210, y: 210, w: 50, h: 40, verb: 'Tell her something', once: false,
      onUse: async () => {
        await this.play([{ say: { text: S.talk[this.talkLine++ % S.talk.length] } }]);
        await this.milestone();
      },
    });
    this.interactions.add({
      x: 305, y: 90, w: 50, h: 50, verb: 'Ask the nurse', once: false,
      onUse: async () => {
        const line = S.nurse[this.nurseLine++ % S.nurse.length];
        await this.play([{ say: { speaker: 'Nurse', text: line } }]);
        if (line === 'Soon.') {
          await this.playFree([{ note: { time: this.phaseTime(), text: S.noteSoon1 } }]);
        }
        await this.milestone();
      },
    });
  }

  private phaseTime(): string {
    return ['15:00', '19:10', '23:52', '03:10'][this.phase] ?? '06:30';
  }

  /** Time thickens every few acts of help. Her requests shrink.
   *  Real timeline: admitted Monday afternoon; she pushes at 07:00 Tuesday;
   *  the baby is born at 10:02. */
  private async milestone(): Promise<void> {
    this.acts++;
    if (this.acts === 3 && this.phase === 0) {
      this.phase = 1;
      await this.ui.timeCard('19:10');
      this.ui.setAmbience(0x9aa0b4, 0.34);
      await this.playFree([{ clock: 'MON 19:10' }, { say: { speaker: 'Wife', text: S.wifeHand } }]);
    } else if (this.acts === 5 && this.phase === 1) {
      this.phase = 2;
      await this.ui.timeCard('23:52');
      this.ui.setAmbience(0x7e849c, 0.42);
      audio.setMusic('music/delivery', 0.08); // the music thins out —
      audio.startBeep(0.16); // — the beep is most of what's left of the world
      await this.playFree([{ clock: 'MON 23:52' }, { say: { text: S.wifeQuiet } }]);
    } else if (this.acts === 7 && this.phase === 2) {
      this.phase = 3;
      await this.ui.timeCard('03:10');
      await this.playFree([{ clock: 'TUE 03:10' }]);
      await this.caesareanScare();
    }
  }

  /** The real thing: "the baby is too high — maybe a caesarean" …
   *  "give it an hour" … and within the hour, the baby came down. */
  private async caesareanScare(): Promise<void> {
    const doctor = this.add.image(300, 240, 'doctor/idle-down').setOrigin(0.5, 1);
    doctor.setDepth(doctor.y);
    // the walls lean in for the worst conversation of the night
    const cam = this.cameras.main;
    this.tweens.add({ targets: cam, zoom: cam.zoom * 1.09, duration: 14_000, ease: 'sine.inOut' });
    await this.playFree([
      { say: { text: S.csRead } },
      { say: { speaker: 'Doctor', text: S.csHigh } },
      { say: { speaker: 'You', text: S.csPlayer } },
      { say: { speaker: 'Doctor', text: S.csWait } },
      { note: { time: '05:50', text: '"Give it an hour."' } },
    ]);
    await this.ui.timeCard('06:50', 1800); // the longest hour of the night
    await this.playFree([
      { clock: 'TUE 06:50' },
      { say: { speaker: 'Doctor', text: S.csDown } },
    ]);
    doctor.destroy();
    this.tweens.killTweensOf(cam);
    this.tweens.add({ targets: cam, zoom: cam.zoom / 1.09, duration: 1800, ease: 'sine.out' }); // breathe out
    await this.ui.timeCard('07:00', 900);
    this.ui.setAmbience(0xa8a49a, 0.3);
    await this.playFree([{ clock: 'TUE 07:00' }]);
    await this.birth();
  }

  private async birth(): Promise<void> {
    this.allowUnlock = false;
    this.player.lock();
    this.setWaypoint(null);
    await this.playFree([
      { say: { speaker: 'Doctor', text: S.itsTime } },
      { say: { speaker: 'Midwife', text: S.mwPush } },
      { say: { speaker: 'Midwife', text: S.mwGood } },
    ]);

    // the room fills — backs between you and the bed
    const crowd = [
      this.add.image(120, 215, 'doctor/idle-up').setOrigin(0.5, 1),
      this.add.image(155, 220, 'nurse/idle-up').setOrigin(0.5, 1),
      this.add.image(190, 216, 'nurse2/idle-down').setOrigin(0.5, 1),
    ];
    crowd.forEach((c) => c.setDepth(c.y + 40));

    this.cameras.main.shake(700, 0.005); // the room becomes weather
    await this.playFree([{ say: { text: S.birthCrowd } }, { wait: 600 }]);
    await this.ui.timeCard('10:02', 1400, true); // three hours of pushing, compressed
    audio.allStop(); // every other sound drops out. exactly as written.
    await this.ui.timeCard(S.babyCry, 2200); // then the world comes back — with her in it
    await this.playFree([
      { say: { text: S.lookAtThem } },
      { say: { speaker: 'Nurse', text: S.stepOutside } },
    ]);
    audio.sfx('sfx/door-close', { volume: 0.6, rate: 0.9 });
    await this.playFree([
      { say: { text: S.doorCloses } },
      { objective: '' },
    ]);
    await this.goTo('Corridor');
  }
}
