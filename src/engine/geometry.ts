/** The one metaphor: the less you know, the longer the hospital gets.
 *  Never surfaced in UI; scenes rebuild silently from this number. */
export function corridorSegments(infoDeficit: number): number {
  return 3 + Math.max(0, Math.floor(infoDeficit));
}
