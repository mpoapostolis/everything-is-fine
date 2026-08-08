import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { StoryScene } from './StoryScene';

const S = EN.ward;

/** CHAPTER 12 — THE ROOM. Other mothers, other bassinets — with babies in
 *  them. Beside her bed: nothing. No one comments. */
export class WardScene extends StoryScene {
  constructor() {
    super('Ward');
  }

  create(): void {
    this.setupWorld(120, 240);
    void this.intro(S.thoughts);
    this.ui.setAmbience(0xc4b49e, 0.22); // colour returning, carefully
    audio.setMusic('music/ward', 0.26);
    audio.setLayer(null);

    const room = this.room.interior(0, 64, 460, 200, 'surface/delivery-floor', 'surface/delivery-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    this.room.wallDecal(70, 40, 'sign/ward-a');
    this.room.wallDecal(240, 38, 'prop/wall-clock');
    this.room.lightPool(150, 170, 150, 70, 0xffe4bc, 0.09);

    // other mothers, other babies — each bed has a bassinet WITH a baby
    this.room.prop(320, 140, 'prop/bed-green');
    this.add.image(370, 140, 'baby/cot').setOrigin(0.5, 1).setDepth(140).setScale(0.8);
    this.room.prop(400, 200, 'prop/bed-green');
    this.add.image(438, 198, 'baby/cot').setOrigin(0.5, 1).setDepth(198).setScale(0.8);

    // her. And beside her bed — nothing.
    this.room.prop(150, 175, 'wife/in-bed');
    this.room.prop(220, 140, 'prop/iv-stand');

    void (async () => {
      await this.playFree([{ clock: 'TUE 18:00' }, { objective: S.objGoToHer }]);
      // wait for the entry thoughts to finish before she speaks
      while (this.ui.busy) {
        await new Promise((r) => this.time.delayedCall(200, r));
      }
      await this.playFree([{ say: { text: S.nurseTen } }]);
    })();
    this.setWaypoint(150, 175);

    this.interactions.add({
      x: 105, y: 155, w: 90, h: 60, verb: S.holdHand, once: true,
      onUse: async () => {
        this.setWaypoint(null);
        await this.play([
          // the fear first: is she awake? is she—
          { say: { text: S.sheTurned } },
          { say: { speaker: 'You', text: S.youHey } },
          { say: { text: S.nothingBeat } },
          { wait: 1200 },
          { say: { speaker: 'Wife', text: S.wifeDots } },
          { say: { speaker: 'Wife', text: S.wifeHey } },
          { say: { speaker: 'You', text: S.youOkayQ } },
          { say: { text: S.sheWaits } },
          { wait: 1400 },
          { say: { speaker: 'Wife', text: S.wifeDontRemember } },
          { say: { speaker: 'You', text: S.youYoureHere } },
          { say: { text: S.firstTouch } },
          { say: { speaker: 'Wife', text: S.wifeAsk } },
          { say: { speaker: 'You', text: S.youTell } },
          { say: { text: S.asleep } },
          { say: { text: S.emptyBassinet } },
          { objective: S.objSleep },
        ]);
        // no hard cut: you stay with her a while, and the world leaves slowly
        this.time.delayedCall(5_200, () => void this.goTo('End', 2200));
      },
    });
  }
}
