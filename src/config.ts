/** Global game constants and build edition. */
export type Edition = 'public' | 'personal';

export const GameConfig = {
  TILE: 32,
  WIDTH: 960,
  HEIGHT: 540,
  EDITION: ((import.meta.env?.VITE_EDITION as string) === 'personal'
    ? 'personal'
    : 'public') as Edition,
} as const;
