import { StoryScene } from './StoryScene';

/** Dev playground: a hospital waiting corridor, built properly.
 *  Doubles as the visual reference for the real scenes. ?scene=Debug */
export class DebugScene extends StoryScene {
  constructor() {
    super('Debug');
  }

  create(): void {
    this.setupWorld(240, 240);
    this.ui.setAmbience(0xb8c4d4, 0.28); // cold hospital cast

    // corridor: long room, waiting alcove
    const room = this.room.interior(0, 64, 640, 240, 'surface/hosp-floor', 'surface/hosp-wall');
    this.cameras.main.setBounds(-40, -60, room.width + 80, room.height + 200);

    // wall dressing
    this.room.wallDecal(96, 40, 'sign/wait-here');
    this.room.wallDecal(320, 36, 'prop/wall-clock');
    this.room.wallDecal(500, 40, 'sign/icu');
    this.room.door(240, 62, 'door/double-exit', { solid: true });
    this.room.door(576, 62, 'door/elevator', { solid: true });

    // furniture
    this.room.prop(80, 160, 'prop/vending');
    this.room.prop(180, 130, 'prop/chairs-row');
    this.room.prop(430, 130, 'prop/chairs-row');
    this.room.prop(620, 170, 'prop/bin-grey');
    this.room.prop(520, 260, 'prop/wheelchair');
    this.room.prop(348, 130, 'prop/side-table');

    // people
    const wife = this.add.image(456, 246, 'wife/idle-down').setOrigin(0.5, 1);
    wife.setDepth(wife.y);
    const nurse = this.add.image(600, 250, 'nurse/idle-down').setOrigin(0.5, 1);
    nurse.setDepth(nurse.y);

    this.interactions.add({
      x: 56, y: 120, w: 60, h: 50, verb: 'Buy something',
      onUse: async () => {
        await this.play([
          { say: { text: 'The machine hums. You are not hungry. You buy the chocolate anyway.' } },
          { note: { time: '03:12', text: 'ate standing up. she can\'t.' } },
          { objective: 'Wait.' },
          { clock: '03:12' },
        ]);
      },
    });
    this.interactions.add({
      x: 428, y: 200, w: 60, h: 50, verb: 'Talk',
      onUse: async () => {
        await this.play([
          { say: { speaker: 'Wife', text: 'Last quiet morning. Maybe.' } },
        ]);
      },
    });
    this.interactions.add({
      x: 570, y: 200, w: 60, h: 54, verb: 'Ask',
      onUse: async () => {
        await this.play([
          { say: { speaker: 'Nurse', text: "Everything's fine. She'll be out in about an hour." } },
          { note: { time: '21:10', text: '"About an hour."' } },
        ]);
      },
    });
  }
}
