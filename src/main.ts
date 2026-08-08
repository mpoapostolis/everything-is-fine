import Phaser from 'phaser';
import { GameConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { CheckupScene } from './scenes/CheckupScene';
import { CorridorScene } from './scenes/CorridorScene';
import { DebugScene } from './scenes/DebugScene';
import { DeliveryScene } from './scenes/DeliveryScene';
import { EndScene } from './scenes/EndScene';
import { FinaleScene } from './scenes/FinaleScene';
import { HomeCallScene } from './scenes/HomeCallScene';
import { NicuScene } from './scenes/NicuScene';
import { PrologueScene } from './scenes/PrologueScene';
import { SignatureScene } from './scenes/SignatureScene';
import { SliceEndScene } from './scenes/SliceEndScene';
import { UiScene } from './scenes/UiScene';
import { WardScene } from './scenes/WardScene';
import { WatersScene } from './scenes/WatersScene';

async function startGame(): Promise<void> {
  // the pixel font must exist before any text renders
  try {
    await document.fonts.load('20px GameFont');
  } catch {
    // font failed to load — the monospace fallback takes over
  }

  const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  backgroundColor: '#0a0c10',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scale: {
    mode: Phaser.Scale.RESIZE, // the canvas IS the browser window, 1:1, always
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    UiScene,
    PrologueScene,
    CheckupScene,
    WatersScene,
    DeliveryScene,
    CorridorScene,
    NicuScene,
    HomeCallScene,
    SignatureScene,
    WardScene,
    EndScene,
    FinaleScene,
    SliceEndScene,
    DebugScene,
  ],
  });

  // dev handle for playtesting tools; harmless in production builds
  (window as unknown as { __game: Phaser.Game }).__game = game;
}

void startGame();
