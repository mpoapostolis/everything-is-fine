import Phaser from 'phaser';
import { EN } from '../data/strings.en';
import { audio } from '../engine/audio';
import { StoryScene } from './StoryScene';

const S = EN.finale;
const E = EN.end;

/** THE FOURTH DAY — home, with her. The same house from the prologue,
 *  plus one bassinet. The game's last verb: lay her in the crib. */
export class FinaleScene extends StoryScene {
  protected override stepSound = 'sfx/step-wood';
  private laid = false;

  constructor() {
    super('Finale');
  }

  create(): void {
    this.setupWorld(150, 200);
    this.ui.setAmbience(0xf2ddb8, 0.09); // morning again, honest this time
    audio.setMusic('music/ending', 0.32);

    const room = this.room.interior(0, 64, 520, 260, 'surface/home-floor', 'surface/home-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 220);

    // the prologue's house, remembered exactly
    this.room.door(60, 62, 'home/door', { solid: true });
    this.room.wallDecal(100, 42, 'home/key-hook');
    this.room.wallDecal(230, 40, 'home/window');
    this.room.wallDecal(400, 40, 'home/window');
    this.room.wallDecal(320, 42, 'prop/wall-art');
    this.room.wallDecal(170, 38, 'prop/wall-clock-b');
    this.room.lightPool(230, 110, 130, 60, 0xffe9c0, 0.1);
    this.room.lightPool(400, 110, 130, 60, 0xffe9c0, 0.1);
    this.room.motes(230, 115, 120, 60);
    this.room.motes(400, 115, 120, 60);
    this.add.image(66, 92, 'home/rug').setDepth(-9).setScale(0.5);
    this.room.prop(440, 116, 'home/kitchen-counter');
    this.add.image(250, 190, 'home/rug').setDepth(-9);
    this.room.prop(250, 172, 'home/couch');
    this.room.prop(268, 250, 'home/table');
    this.room.prop(160, 116, 'home/tv-stand');
    // her pills and the baby's bottle, one table, both truths
    this.add.image(256, 232, 'prop/pills-jar').setDepth(252).setScale(0.7);
    this.add.image(280, 233, 'prop/water-bottle').setDepth(252).setScale(0.6);
    // the nursery corner, finally in use
    this.add.image(456, 296, 'home/rug').setDepth(-9).setScale(0.8);
    this.room.lightPool(456, 296, 120, 70, 0xffe0b8, 0.1);
    this.room.motes(456, 290, 110, 60, 0xffe0b8, 8);
    this.room.prop(456, 300, 'home/crib');
    this.room.prop(456, 268, 'home/crib-mobile', { solid: false });
    this.add.image(466, 292, 'home/bear').setDepth(300);
    this.room.prop(505, 282, 'home/wardrobe');
    // no more box by the door — the car seat is installed, its job done

    // the bassinet, just carried in
    const bassinet = this.room.prop(200, 250, 'baby/bassinet', { solid: false });
    // Karma, at the door, doing the inspection of her life
    const karma = this.add.image(120, 120, 'home/dog').setDepth(120);
    this.tweens.add({ targets: karma, x: 140, duration: 2800, yoyo: true, repeat: -1, ease: 'sine.inout' });
    const wife = this.add.image(320, 205, 'wife/idle-down').setOrigin(0.5, 1);
    wife.setDepth(wife.y);

    void (async () => {
      await this.intro(S.thoughts);
      await this.playFree([
        { clock: 'SUN 16:30' },
        { objective: S.objLay },
      ]);
      this.setWaypoint(200, 250);
    })();

    this.interactions.add({
      x: 95, y: 95, w: 55, h: 45, verb: 'Karma', once: true,
      onUse: async () => {
        await this.play([{ say: { text: S.karma } }]);
      },
    });
    this.interactions.add({
      x: 296, y: 168, w: 50, h: 46, verb: 'Talk to her', once: true,
      onUse: async () => {
        await this.play([
          { say: { speaker: 'Wife', text: S.wifeHome } },
          { say: { text: S.wifeCareful } },
        ]);
      },
    });
    this.interactions.add({
      x: 244, y: 226, w: 52, h: 40, verb: 'The discharge papers', once: true,
      onUse: async () => {
        // the whole truth, once, on paper, optional — exactly like real life
        await this.play([{ say: { text: S.papers } }]);
      },
    });

    // pick her up at the bassinet, lay her in the crib you built on Monday
    this.interactions.add({
      x: 172, y: 218, w: 56, h: 50, verb: 'Pick her up', once: true,
      onUse: async () => {
        await this.play([{ say: { text: S.lift } }]);
        bassinet.setVisible(false);
        this.setWaypoint(456, 290);
      },
    });
    this.interactions.add({
      x: 428, y: 262, w: 60, h: 50, verb: 'Lay her down',
      enabled: () => !bassinet.visible && !this.laid,
      onUse: async () => {
        this.laid = true;
        this.setWaypoint(null);
        // the baby, asleep, in the crib with the bear and the mobile
        this.add.image(456, 294, 'baby/bassinet').setOrigin(0.5, 1).setDepth(299).setScale(0.8);
        await this.play([
          { objective: '' },
          { wait: 1400 },
          { say: { text: S.breathing } },
          { wait: 1200 },
        ]);
        await this.title();
      },
    });
  }

  /** The last thing anyone reads. */
  private async title(): Promise<void> {
    this.allowUnlock = false;
    this.player.lock();
    try {
      localStorage.removeItem('eif-checkpoint'); // the story is over; next boot starts fresh
    } catch { /* ok */ }
    await this.ui.fadeOut(2200);
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const title = this.add.text(cx, cy - 24, E.title, {
      fontFamily: 'GameFont, monospace', fontSize: '54px', color: '#e8e6df',
    }).setOrigin(0.5).setAlpha(0).setDepth(2100).setScrollFactor(0);
    const sub = this.add.text(cx, cy + 26, E.sub, {
      fontFamily: 'GameFont, monospace', fontSize: '20px', color: '#5a6478',
    }).setOrigin(0.5).setAlpha(0).setDepth(2100).setScrollFactor(0);
    const born = this.add.text(cx, cy + 52, E.born, {
      fontFamily: 'GameFont, monospace', fontSize: '18px', color: '#5a6478',
    }).setOrigin(0.5).setAlpha(0).setDepth(2100).setScrollFactor(0);
    const ded = this.add.text(cx, cy + 110, E.dedication, {
      fontFamily: 'GameFont, monospace', fontSize: '21px', fontStyle: 'italic', color: '#9aa6ba',
    }).setOrigin(0.5).setAlpha(0).setDepth(2100).setScrollFactor(0);
    // the texts live in THIS scene but must show over the Ui fade — hand
    // them to the Ui scene's display list instead
    for (const t of [title, sub, born, ded]) {
      this.children.remove(t);
      this.ui.add.existing(t);
      t.setDepth(2100);
    }
    this.ui.tweens.add({ targets: title, alpha: 1, duration: 2200, delay: 600 });
    this.ui.tweens.add({ targets: sub, alpha: 1, duration: 1800, delay: 2200 });
    this.ui.tweens.add({ targets: born, alpha: 1, duration: 1800, delay: 3200 });
    this.ui.tweens.add({ targets: ded, alpha: 1, duration: 2600, delay: 5400 });
  }
}

void Phaser; // keep the namespace import for typing
