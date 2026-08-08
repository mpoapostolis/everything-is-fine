import Phaser from 'phaser';

/** Builds rooms from texture patches: tiled floors, solid walls, props.
 *  All solids collect into `.solids` for a single collider with the player. */
export class RoomBuilder {
  solids: Phaser.Physics.Arcade.StaticGroup;

  constructor(private scene: Phaser.Scene) {
    this.solids = scene.physics.add.staticGroup();
  }

  floor(x: number, y: number, w: number, h: number, key: string): Phaser.GameObjects.TileSprite {
    return this.scene.add.tileSprite(x, y, w, h, key).setOrigin(0).setDepth(-10);
  }

  /** Complete enclosed room: floor, back wall (visible), side/front bounds.
   *  Returns the inner walkable rect. */
  interior(
    x: number,
    y: number,
    w: number,
    h: number,
    floorKey: string,
    wallKey: string,
  ): Phaser.Geom.Rectangle {
    const wallTex = this.scene.textures.get(wallKey).getSourceImage() as HTMLImageElement;
    const wallH = wallTex.height;
    // deliberate dark surround instead of raw void, whatever the window shape
    this.scene.add.rectangle(x - 800, y - 500, w + 1600, h + 1100, 0x0c0f15)
      .setOrigin(0).setDepth(-20);
    this.floor(x, y, w, h, floorKey);
    // back wall band sits INSIDE the top of the room, drawn behind everything
    this.scene.add.tileSprite(x, y - wallH, w, wallH, wallKey).setOrigin(0).setDepth(y - 1);
    this.block(x - 8, y - wallH, w + 16, wallH - 6); // solid behind the wall band
    this.block(x - 8, y - wallH, 8, h + wallH); // left
    this.block(x + w, y - wallH, 8, h + wallH); // right
    this.block(x - 8, y + h, w + 16, 8); // front
    return new Phaser.Geom.Rectangle(x, y, w, h);
  }


  /** Horizontal wall strip; solid across its full width. */
  wallH(x: number, y: number, w: number, key: string): Phaser.GameObjects.TileSprite {
    const tex = this.scene.textures.get(key).getSourceImage() as HTMLImageElement;
    const t = this.scene.add.tileSprite(x, y, w, tex.height, key).setOrigin(0).setDepth(y + tex.height - 6);
    this.addStaticBody(x, y + tex.height * 0.3, w, tex.height * 0.7);
    return t;
  }

  /** Invisible blocker (room bounds, furniture edges). */
  block(x: number, y: number, w: number, h: number): void {
    this.addStaticBody(x, y, w, h);
  }

  prop(
    x: number,
    y: number,
    key: string,
    opts: { solid?: boolean; depthBias?: number; shadow?: boolean } = {},
  ): Phaser.GameObjects.Image {
    const img = this.scene.add.image(x, y, key).setOrigin(0.5, 1);
    img.setDepth(y + (opts.depthBias ?? 0));
    if (opts.shadow !== false) {
      this.scene.add
        .ellipse(x, y - 1, img.displayWidth * 0.8, 7, 0x000000, 0.16)
        .setDepth(y - 1);
    }
    if (opts.solid !== false) {
      const w = img.displayWidth * 0.85;
      const h = Math.min(16, img.displayHeight * 0.35);
      this.addStaticBody(x - w / 2, y - h, w, h);
    }
    return img;
  }

  /** Soft pool of light on the floor (from a window, a ceiling lamp). */
  lightPool(
    x: number, y: number, w: number, h: number,
    color = 0xfff2d8, alpha = 0.07,
  ): Phaser.GameObjects.Ellipse {
    return this.scene.add.ellipse(x, y, w, h, color, alpha).setDepth(-5)
      .setBlendMode(Phaser.BlendModes.SCREEN);
  }

  /** A person who stands somewhere: sprite + grounding shadow. */
  person(x: number, y: number, key: string): Phaser.GameObjects.Image {
    this.scene.add.ellipse(x, y - 1, 22, 7, 0x000000, 0.18).setDepth(y - 1);
    const img = this.scene.add.image(x, y, key).setOrigin(0.5, 1);
    img.setDepth(y);
    return img;
  }

  /** Wall-mounted image (signs, windows, clocks): never solid, drawn above walls. */
  wallDecal(x: number, y: number, key: string): Phaser.GameObjects.Image {
    return this.scene.add.image(x, y, key).setOrigin(0.5).setDepth(y + 500);
  }

  door(
    x: number,
    y: number,
    key: string,
    opts: { solid?: boolean } = {},
  ): Phaser.GameObjects.Image {
    const img = this.scene.add.image(x, y, key).setOrigin(0.5, 1);
    img.setDepth(y + 6); // doors live ON the wall — above it, below people
    if (opts.solid) {
      this.addStaticBody(x - img.displayWidth / 2, y - 14, img.displayWidth, 14);
    }
    return img;
  }

  private addStaticBody(x: number, y: number, w: number, h: number): void {
    const zone = this.scene.add.zone(x + w / 2, y + h / 2, w, h);
    this.scene.physics.add.existing(zone, true);
    this.solids.add(zone);
  }
}
