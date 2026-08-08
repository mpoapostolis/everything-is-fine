# EVERYTHING IS FINE — Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A playable 15-minute vertical slice: Prologue (home) → Ch 1 (check-up, waters break) → Ch 2 (admission + helping verbs) → Ch 4 ending beat (the door closes) → Ch 5 (the corridor grows), proving every core system of the full game.

**Architecture:** Phaser 3 scenes driven by a small data-driven script runner (JSON-like step lists: dialogue, objectives, waits, interactions). Pure-logic systems (state, notebook, script engine) are plain TS modules tested with vitest; Phaser scenes are thin presentation layers verified in the browser. No Tiled: rooms are built programmatically from texture patches sliced out of the AI sheets by a Python pipeline.

**Tech Stack:** Phaser 3.87+, TypeScript 5, Vite 6, vitest 3, Python 3 + Pillow/numpy (asset pipeline).

## Global Constraints (from docs/scenario.md)

- English strings only, externalized in `src/data/strings.en.ts` (future `el` file swaps in).
- **No blood shown, ever** (design rule #4). The v1 spare sheet's stained tiles are banned.
- No combat, no fail state, no game over.
- The phrase "Everything's fine." and the word "a little" are script data, never hardcoded in scenes.
- Notebook logs quotes verbatim with timestamps; the game never edits them.
- The distance metaphor is implemented as data (corridor segment counts), never surfaced in UI.
- Not a git repository yet — commit steps are DEFERRED until the user opts into git.

## File Structure

```
package.json / tsconfig.json / vite.config.ts / vitest.config.ts / index.html
.claude/launch.json          # preview server config
tools/slice.py               # bg removal + sprite detection → crops + manifest
tools/labels/*.json          # detected-box → logical frame name maps (hand-labeled)
assets-raw/                  # source sheets (existing)
public/assets/               # game-ready: sprites/, tiles/, props/  (pipeline output)
src/main.ts                  # Phaser boot
src/config.ts                # edition flag, constants (TILE=32, ZOOM)
src/engine/GameState.ts      # flags, chapter, clock (diegetic time)
src/engine/Notebook.ts       # timestamped verbatim entries
src/engine/ScriptRunner.ts   # step interpreter: say/objective/wait/setflag/goto
src/engine/types.ts          # Step, ScriptContext interfaces
src/ui/DialogueBox.ts        # bottom text box, letter-by-letter, speaker tag
src/ui/ObjectiveHud.ts       # top-left objective text (can decay to "…")
src/ui/ClockHud.ts           # top-right diegetic clock (hidden until Ch 2)
src/ui/InteractPrompt.ts     # floating [E] prompt
src/world/PlayerController.ts# 4-dir movement + facing + interact raycast
src/world/RoomBuilder.ts     # floors/walls/doors from texture patches
src/world/Interactable.ts    # zone + callback + one-shot/repeat
src/scenes/BootScene.ts      # asset load + font
src/scenes/PrologueScene.ts  # home (placeholder home tiles)
src/scenes/CheckupScene.ts   # Ch 1 hospital + return-home beat
src/scenes/DeliveryScene.ts  # Ch 2 helping verbs + Ch 4 door beat
src/scenes/CorridorScene.ts  # Ch 5 growing corridor
src/scenes/SliceEndScene.ts  # "end of slice" card
src/data/strings.en.ts       # ALL player-facing text
src/data/scripts/*.ts        # per-chapter step lists
tests/*.test.ts              # vitest: state, notebook, runner, corridor growth
```

---

### Task 1: Project scaffold + boot

**Files:** Create `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/main.ts`, `src/config.ts`, `src/scenes/BootScene.ts`, `.claude/launch.json`.

**Interfaces produced:** `GameConfig` in `src/config.ts`: `{ TILE: 32, WIDTH: 960, HEIGHT: 540, EDITION: 'public' | 'personal' }` (from `import.meta.env.VITE_EDITION`, default `public`). `main.ts` registers all scenes; BootScene starts first registered story scene.

- [ ] `npm create` equivalent by hand: package.json with phaser, typescript, vite, vitest; `npm install`.
- [ ] Phaser game boots: black canvas, pixelArt true, arcade physics, scale FIT.
- [ ] BootScene displays placeholder text "EVERYTHING IS FINE — slice dev build" to prove render.
- [ ] `.claude/launch.json` entry `dev` → `npm run dev` port 5173. Verify via preview: canvas visible, no console errors.

### Task 2: Asset pipeline — detection

**Files:** Create `tools/slice.py`.

**Interfaces produced:** CLI `python3 tools/slice.py <sheet.png> --out <dir> --bg auto|green|grey [--min-area 400]`. Removes background (flood-fill from corners + color-distance threshold; handles flat and gradient bgs), finds connected components, merges touching boxes, writes `crop_NNN.png` (transparent) + `manifest.json` `[{i, x, y, w, h}]` sorted row-major.

- [ ] Implement with Pillow+numpy only (no OpenCV dependency).
- [ ] Run on `player.png`; read 3-4 crops back visually to confirm clean cutouts (no halo, full body).
- [ ] Run on `staff.png` (green bg), `wife-baby.png`, `hospital-props.png`, `hospital-tileset.png`.
- [ ] Acceptance: every visible figure/prop of each sheet appears as exactly one crop (tuning `--min-area` as needed).

### Task 3: Frame labeling + atlas packing

**Files:** Create `tools/labels/player.json`, `staff.json`, `wife-baby.json`, `props.json`, `tiles.json`; `tools/pack.py`.

**Interfaces produced:** label file format `{ "crop_003": "player/idle-down", ... }`; `pack.py` reads crops+labels → writes `public/assets/sprites/<name>.png` normalized to a common baseline (bottom-center anchor, canvas 48×64 for characters) and a combined `frames.json`. Scenes load individual PNGs by logical name via a generated `src/data/assetIndex.ts`.

- [ ] Label player sheet by visual inspection (idle+walk ×4 dirs, phone, head-in-hands, sit-slumped, reach).
- [ ] Label wife (idle/walk/pain/bed/chair-iv/wheelchair-baby/sit-hunched), baby states (cot/incubator/bassinet).
- [ ] Label staff (doctor idle ×4, nurse idle ×4 + point, receptionist-desk) and props needed by the slice: double-door, single-door, elevator, signs (EXIT, ICU, WARD A, WAIT HERE, ACCESS DENIED), chairs-row, vending, wall-clock, iv-stand, monitor, hospital-bed, delivery-bed, stool, side-table.
- [ ] Tiles: floor patches (lobby light, corridor grey, delivery warm-grey), wall strips, skirting. Extract as repeatable patches (power-of-two-ish rectangles ok; `RoomBuilder` uses `tileSprite`).
- [ ] Home placeholders (until real home sheet exists): generate `tools/placeholders.py` → plain wood-plank floor tile, cream wall, rug, and flat-color furniture blocks (bed, couch, crib, table, door, key-hook, bag, car-seat-box) in the same muted palette. Mark all with `placeholder-` prefix.
- [ ] Acceptance: BootScene loads every asset in `assetIndex.ts` with zero 404s.

### Task 4: GameState + Notebook (TDD)

**Files:** Create `src/engine/GameState.ts`, `src/engine/Notebook.ts`, `tests/state.test.ts`, `tests/notebook.test.ts`.

**Interfaces produced:**
- `GameState`: `flags: Set<string>`, `set(f)`, `has(f)`, `clock: { visible: boolean; hhmm: string }`, `setClock(hhmm)`, `chapter: string`, singleton `gameState` + `resetGameState()` for tests.
- `Notebook`: `add(time: string, text: string)`, `entries(): ReadonlyArray<{time,text}>` (append-only, verbatim, insertion order — contradictions must stack, never dedupe).

- [ ] Failing tests: flag set/has; clock hidden by default; notebook append-only order; duplicate quotes at different times both kept.
- [ ] Implement minimal; `npx vitest run` green.

### Task 5: ScriptRunner (TDD)

**Files:** Create `src/engine/types.ts`, `src/engine/ScriptRunner.ts`, `tests/runner.test.ts`.

**Interfaces produced:**
```ts
type Step =
  | { say: { speaker?: string; text: string } }
  | { objective: string }            // '' hides; '…' allowed
  | { note: { time: string; text: string } }
  | { flag: string }
  | { clock: string | null }         // null hides clock
  | { wait: number }                 // ms, skippable=false
  | { call: (ctx: ScriptContext) => Promise<void> | void };
interface ScriptContext { state: GameState; notebook: Notebook; ui: UiPort }
interface UiPort { say(speaker: string|undefined, text: string): Promise<void>;
                   setObjective(t: string): void; setClock(t: string|null): void }
class ScriptRunner { constructor(ctx: ScriptContext); run(steps: Step[]): Promise<void>; }
```
`UiPort` lets tests run scripts headless with a fake UI; scenes pass the real HUD.

- [ ] Failing tests with fake UiPort: steps execute in order; `note` writes notebook; `objective ''` clears; runner awaits `say` resolution.
- [ ] Implement; vitest green.

### Task 6: HUD + dialogue UI

**Files:** Create `src/ui/DialogueBox.ts`, `src/ui/ObjectiveHud.ts`, `src/ui/ClockHud.ts`, `src/ui/InteractPrompt.ts`, `src/scenes/UiScene.ts` (persistent overlay scene implementing `UiPort`).

**Interfaces produced:** `UiScene` implements `UiPort`; `say()` types text letter-by-letter (24ms/char, E/Space to complete then confirm), speaker tag uppercase. ObjectiveHud top-left, fades between texts. ClockHud top-right `HH:MM`, hidden when null. InteractPrompt: `showAt(x,y)` / `hide()`.

- [ ] Build; manual browser check via a temporary debug script that exercises all four widgets.

### Task 7: Player + world building blocks

**Files:** Create `src/world/PlayerController.ts`, `src/world/RoomBuilder.ts`, `src/world/Interactable.ts`.

**Interfaces produced:**
- `PlayerController(scene, x, y)`: arcade body 20×14 at feet, speed 110 (walk-only game), 4-dir facing, plays `player/idle-*`, `player/walk-*`; `lock()/unlock()` for cutscenes; `facingPoint(dist)` for interaction probe.
- `RoomBuilder(scene)`: `floor(x,y,w,h,patchKey)`, `wallH/wallV(...)` (adds static bodies), `door(x,y,key,{locked?,label?})`, `prop(x,y,key,{solid?})` — returns display objects; collisions via one static group exposed as `.solids`.
- `Interactable(scene, x, y, w, h, {label, once?, onUse})`; scene-level `InteractionSystem` picks nearest in-range interactable facing the player, drives `InteractPrompt`, fires on E.

- [ ] Build; debug room with two props and a door; verify walk/collide/interact in browser.

### Task 8: PrologueScene — HOME

**Files:** Create `src/scenes/PrologueScene.ts`, `src/data/scripts/prologue.ts`, `src/data/strings.en.ts` (grows every task).

Spec beats implemented (scenario.md PROLOGUE): house sounds only (silence ok in slice — audio deferred), interactions: water, nursery (hang mobile → place bear → fold onesie, 3-step sequence gated in order), car-seat box (wife line: "Leave it. We'll install it after the check-up. We have time."), hospital bag check, wife line "Last quiet morning. Maybe.", then objective "Drive to the hospital for the routine check-up." → keys on hook interactable → fade → CheckupScene. Dog omitted (asset missing) — logged in plan deviations.

- [ ] Script data first (steps + strings), scene wiring second, browser walkthrough: all beats reachable, keys gated until nursery + bag done.

### Task 9: CheckupScene — CH 1

Lobby: reception desk, waiting family near elevator, exam room right. OB dialogue: "Everything looks fine. Come back tomorrow morning." → notebook first entry `10:40 — "Everything's fine. Come back tomorrow."` → objective "Go home." → fade → home kitchen beat: wife freeze, "…My waters just broke." → objective "Go back to the hospital." → keys → fade to DeliveryScene. Music-first-appearance marked with `// AUDIO:` comment stubs (audio pass is post-slice).

- [ ] Script + scene + browser walkthrough; notebook shows entry via debug key N (dev-only overlay listing entries).

### Task 10: DeliveryScene — CH 2 (+ the door, CH 4 beat)

Clock appears (`19:43`). Wife in bed. **Helping verbs**, each a repeatable interactable with visible effect (her sprite/pose + one-line responses): water cup, hold-hand (hold E for 3s during contraction prompts every ~45s), "Talk to me" (3 micro-stories menu), call nurse. Nurse rotates: "Not yet." / "We wait." / "Soon." / "Everything's fine." Notebook logs `19:43 — "May have broken earlier." When? No answer.` Time-skip cards (23:52 / 03:10 / 06:37) compress Ch 3 into three beats — each reduces her requests (final beat: no requests). Then: staff crowd in, screen edge vignette, baby cry (text card in slice: **[a baby crying]**), `[E] Look at them`, nurse: "You need to step outside now." → door closes → hard cut to CorridorScene. 

- [ ] Script + scene + browser walkthrough of full chain without softlocks.

### Task 11: CorridorScene — CH 5 (the geometry)

**Files:** Create `src/scenes/CorridorScene.ts`, `src/data/scripts/corridor.ts`, `tests/corridor.test.ts`.

**Interfaces produced:** pure helper `corridorSegments(infoDeficit: number): number` in `src/engine/geometry.ts` — base 3 segments, +1 per unresolved contradiction (TDD this). Scene rebuilds corridor from segment count on each re-entry from an ask-beat; the player never sees it change on-screen.

Beats: objective "Wait for your wife."; bench sit (E toggles); nurse 1: "Everything's fine. She's got a bit of a fever, we're keeping an eye on it. She'll be out in about an hour." → note `21:10 — "A bit of a fever." — "About an hour."` → time cut → nurse 2: "Maybe two more hours." → note stacks → corridor +1 segment, wall clock offset −25 min from HUD clock; locked doors (`WAIT OUTSIDE`, `STAFF ONLY`); the one unlocked wrong door → celebrating-family tableau (staff sprites + balloons placeholder = colored circles) → auto-close; objective decays "Wait." → "…". Slice ends: fade → SliceEndScene card: "— end of slice —".

- [ ] TDD `corridorSegments`; script + scene; browser walkthrough; confirm corridor is longer after second ask and no UI ever mentions it.

### Task 12: Slice pass

- [ ] Full playthrough start→end in browser; fix softlocks; confirm all strings come from `strings.en.ts`; `npx vitest run` green; `npx tsc --noEmit` clean.

## Deviations & deferrals (explicit)

- Audio: entire pass deferred (user will supply sounds; `// AUDIO:` markers placed at every scripted cue from the spec).
- Dog, home art, exterior/car: assets missing → placeholders or omission, listed in assets-raw/README.md.
- Git: not initialized; all commit steps deferred until user opts in.
- Signature set-piece, phone item, Ch 6–15: out of slice scope by design.
