import Phaser from 'phaser';
import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { StoryScene } from './StoryScene';

const S = EN.signature;
const STROKES = 12;
const MS_PER_STROKE = 380;

/** CHAPTER 9 — THE SIGNATURE. The only real power the game ever gives you:
 *  authorizing an act on her body, knowing nothing. Hold E to sign. */
export class SignatureScene extends StoryScene {
  private signing = false;
  private signed = false;
  private accum = 0;
  private sfxAccum = 0;
  private scrawl!: Phaser.GameObjects.Text;
  private eKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('Signature');
  }

  create(): void {
    this.setupWorld(160, 220);
    this.ui.setAmbience(0xb0bccc, 0.24);
    audio.setMusic('music/waters', 0.3);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    const room = this.room.interior(0, 64, 320, 170, 'surface/hosp-floor', 'surface/hosp-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    this.room.wallDecal(70, 40, 'sign/ward-a');
    this.room.lightPool(160, 130, 160, 70, 0xdfe8f0, 0.08);
    this.room.prop(160, 130, 'prop/desk-papers');
    this.room.person(215, 128, 'doctor/idle-down');
    this.scrawl = this.add.text(160, 96, '', {
      fontFamily: 'monospace', fontSize: '10px', color: '#2a2f3a',
      backgroundColor: '#e8e6dfee', padding: { x: 6, y: 3 },
    }).setOrigin(0.5, 1).setDepth(800).setVisible(false);

    void (async () => {
      await this.intro(S.thoughts);
      await this.playFree([
        { clock: 'TUE 14:20' },
        { say: { speaker: 'Doctor', text: S.doc1 } }, // no "little" this time. Notice.
        { say: { speaker: 'Doctor', text: S.doc2 } },
        { objective: S.objSign },
      ]);
      this.setWaypoint(160, 130);
    })();

    this.interactions.add({
      x: 130, y: 100, w: 60, h: 50, verb: 'Sign', once: true,
      onUse: async () => {
        this.setWaypoint(null);
        await this.play([{ say: { text: S.holdHint } }]);
        this.allowUnlock = false;
        this.player.lock();
        this.scrawl.setVisible(true).setText(' ');
        audio.setMusic(null); // every sound drops away except the pen
        this.signing = true;
      },
    });
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    if (!this.signing || this.signed) return;
    if (this.eKey.isDown) {
      this.accum += delta;
      this.sfxAccum += delta;
      if (this.sfxAccum > 340) {
        this.sfxAccum = 0;
        audio.sfx('sfx/paper', { volume: 0.5, rate: 1.5 + Math.random() * 0.3 });
      }
      const strokes = Math.min(STROKES, Math.floor(this.accum / MS_PER_STROKE));
      this.scrawl.setText('◟' + '﹏'.repeat(strokes) + (strokes < STROKES ? '_' : '◞'));
      if (strokes >= STROKES) {
        this.signed = true;
        this.signing = false;
        void this.afterSignature();
      }
    }
    // release = the pen stops. The progress stays. You must finish it.
  }

  private async afterSignature(): Promise<void> {
    await this.playFree([
      { wait: 700 },
      { say: { speaker: 'You', text: S.canISee } },
      { say: { speaker: 'Doctor', text: S.notYet } },
      { note: { time: '14:30', text: S.noteNotYet } },
      { objective: '' },
    ]);
    await this.ui.timeCard(S.twoHours, 2200, true); // black straight into the ward
    await this.goTo('Ward', 600);
  }
}
