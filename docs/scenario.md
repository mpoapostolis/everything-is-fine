# EVERYTHING IS FINE
### Full scenario — v2 (English)

> A 2D top-down narrative game about the day a man's daughter was born,
> his wife almost died, and everyone kept telling him everything was fine.
> Based on a true story.

**Logline:** You can't fight anything. You can't save anyone. You can hold a hand,
ask questions, and wait outside doors. That's the whole game. That was the whole day.

**Length:** ~90 minutes · Prologue + 15 chapters · 4 acts

---

## The Five Rules

Every design decision in this document obeys these. If a scene breaks one, the scene is wrong.

1. **You never fight. You wait, you ask, you hold.** There is no combat, no game over,
   no fail state. The only verbs are small and human.
2. **The game never lies to the player — people in it do.** The notebook records every
   quote with its timestamp, verbatim. The horror is watching the contradictions stack
   up on their own.
3. **One metaphor only: distance.** The less you know, the longer the hospital gets.
   Never explained, never in the UI. Two exceptions carry the meaning:
   the route to the NICU **never changes**, and in the final act the world
   becomes **smaller than normal**.
4. **Nothing graphic is ever shown.** No blood on screen, ever. Everything terrible
   happens behind doors and inside words. The birth is heard, not seen. The word
   "third-degree tear" appears exactly once — on a discharge paper, at the end,
   optional to read.
5. **The player is offered a meaningful choice exactly once — and it's fake.**
   ("Okay?") Because that's the truth of it.

---

## The Two Phrases

The entire script hangs on two phrases. Track them like ammunition.

### "Everything's fine."
| Act | Who says it | What it is |
|---|---|---|
| Ch 1 | The OB, at the check-up | **True.** |
| Ch 2–10 | Every nurse, the doctor, the phone — dozens of times | **A lie.** The phrase they use to make you go away. |
| Ch 9 | **Your wife**, on oxygen, barely able to speak: *"It's fine."* | The worst single line in the game. |
| Ch 11–15 | **Nobody.** The phrase disappears entirely. | Its absence is the tension. |
| Title card | No one. White text on black. | **True again.** And it retroactively rewrites the whole game. |

### "A little."
The doctor delivers the truth in two-hour doses, each one wrapped in "a little":

> **+2h** — "She's got a bit of a fever. Okay?"
> **+4h** — "She needs a little oxygen. Just to help her breathe."
> **+6h** — "She's lost **a lot** of blood."

The one time the word "little" breaks — that's the klaxon. No music sting needed.
The player has been trained for two hours; the missing word does all the work.

**Act IV inversion:** after the crisis, "a little" flips polarity and comes back healed:
*"Fever's down a little." "She ate a little today." "A little further each day."*
Small bad things become small good things. Same word, redeemed.

---

## Cast

Names are placeholders resolved from a config file at build time.

| ID | Personal build | Public build |
|---|---|---|
| PLAYER | (real name) | "You" — never named |
| WIFE | (real name) | "Her" — never named |
| DOCTOR | (real name) | "The doctor" |
| OB | (real name) | "The OB" |
| NURSE 1–3, NICU NURSE | — | Unnamed |
| THE OTHER FATHER | — | Unnamed, never speaks |
| THE CLEANER | — | Unnamed, the only warm voice in Act III |
| THE DOG | Karma | Karma (a dog can keep her name in every build) |
| THE BABY | (real name) | "The baby" — no gender stated |

---

# ACT I — BEFORE
*You have everything. The game teaches you tenderness and pretends it's a tutorial.*

## PROLOGUE — HOME
**~8 min · Small apartment, morning. No music. House sounds only: fridge hum, dog tags, street below.**

The player learns to walk, look, interact — on a home that is still whole.

Interactions (all optional except the last):
- **Pet the dog.** It follows you around the whole prologue.
- **Drink water.** (Remember this verb. It comes back as the only thing you can give her.)
- **The nursery — mandatory beat.** It's almost ready. The player *finishes* it:
  - Hang the mobile over the crib.
  - Place the stuffed bear inside it.
  - Fold the tiny clothes into the hospital bag. One onesie on top.
- **The car seat box, by the door.** Interact:
  > WIFE: "Leave it. We'll install it after the check-up. We have time."
  The box stays. **This undone task is a planted wound — it pays off in Ch 14.**
- **Check the hospital bag** against her list (papers, clothes, charger, the onesie).
- WIFE, hand on belly, half-smiling:
  > "Last quiet morning. Maybe."

**Objective: "Drive to the hospital for the routine check-up."**
The player takes **the keys from the hook by the door.** Distinct little sound. Remember the hook.

---

## CHAPTER 1 — THE CHECK-UP
**~5 min · Hospital, late morning. Bright, busy, absolutely normal.**

Lobby full of life: a family with balloons, a new father carrying a car seat toward the exit
(the player walks past his own future without knowing it). Elevator. Maternity floor.

The OB runs the monitor. Paper scrolls out. Routine.

> OB: "Everything looks fine. Come back tomorrow morning."

**The notebook appears** — bottom corner, one line writes itself:
> `10:40 — "Everything's fine. Come back tomorrow."`

Teach the notebook here, while the phrase is still innocent.

**Objective: "Go home."** Car. Cut.

Home. She's in the kitchen. She goes still. Looks down. Looks at you.

> WIFE: "…My waters just broke."

**Music exists for the first time.** Almost inaudible. One held note under the house sounds.

**Objective: "Go back to the hospital."** Bag. Keys off the hook. Door.

---

# ACT II — THE LONG NIGHT
*The game gives you real ways to help her — so it can take every one of them away.*

## CHAPTER 2 — ADMISSION
**~8 min · Evening. Same lobby, different light. The clock appears top-right: 19:43.**

> DOCTOR: "We're keeping her in. The waters may have broken earlier than we thought.
> We need to get labour going tonight."

> PLAYER: "Earlier? When?"
> DOCTOR: "Hard to say. It's fine. We'll take care of her."

Notebook: `19:43 — "May have broken earlier." When? No answer.`

Delivery room. IV line. The CTG monitor starts its beep — quiet, steady.
**That beep never stops for the rest of the act. By Chapter 3 it has become the music.**

**The helping verbs unlock. This is the heart of the game. She asks — you do — it works:**

- **"Water."** — Bring the cup when the nurse allows it. Her face eases. *(She is not allowed
  to eat. She won't eat for 22 hours. The notebook quietly logs it.)*
- **"Hand. Now."** — During each contraction: **hold [E] until it passes.** She squeezes.
  The screen doesn't shake. Just her hand and yours.
- **"Talk to me. Anything."** — Pick a small story from three. She half-laughs at one.
- **"Walk with me."** — Arm in arm down the corridor, slow, IV pole rolling alongside.
- **Call the nurse.** They come. They help. The system works. For now.
- **Watch the monitor.** Numbers you don't understand: `142`. Is that good? Nobody says.

**Every one of these visibly lands.** Her breathing settles. She says thank you.
For forty minutes the game teaches the player one sentence: *I am useful. I am holding her.*

It is teaching them that so it can take it away.

---

## CHAPTER 3 — THE LONG NIGHT
**~12 min · The same room, in slices. Montage of playable scenes.**

*(Real timeline: check-up Monday 09:00 → home by noon → waters → admitted early
afternoon → labour all night → pushing starts 07:00 Tuesday → born 10:02.)*

Time cards between slices: **15:00 — 19:10 — 23:52 — 03:10.**

**The caesarean scare — the night's lowest point, and its one mercy:**
Near dawn the doctor comes in unasked (he only ever comes unasked):

> DOCTOR: "The baby is sitting very high. If nothing changes soon,
> we'll have to do a caesarean."
> PLAYER: "And… what do we do?"
> DOCTOR: "…Give it an hour. Let's see."

Notebook: `05:50 — "Give it an hour."`

**Time card: 06:50 — the longest hour of the night.** Then:

> DOCTOR: "The baby came down. Full dilation. She can push."

The one time in the whole game where "wait" turns out to be good news.
Don't underline it. The player will remember it later, when "wait" stops meaning that.

Each slice, 60–90 seconds, same verbs — but the room degrades:
- The light shifts from evening to fluorescent night to grey morning.
- She is paler each slice. Sweat. The drip is changed. The pillow won't sit right.
- Her requests get smaller: *"Talk to me"* becomes *"Hand."* becomes — nothing.
  **In the last slice she's too tired to ask. The verbs still exist. She just doesn't want them.**
  That is the scariest thing in the act, and no one says a word about it.
- The nurses rotate through four lines: *"Not yet." — "We wait." — "Soon." — "Everything's fine."*
- The beep has fully merged into the score. If the player steps into the corridor,
  **they can still hear it.** They will hear it in the vending machine hum. It's inside them now.

Optional guilt beat: the vending machine works. The player can buy something and eat it
in the corridor. Alone. She can't. The game does not comment.

Notebook, accumulating on its own:
> `06:37 — "Soon."`
> `12:00 — "Soon."`
> `17:20 — she hasn't eaten since yesterday.`

Last slice — the room fills with people. More than seems necessary.

> DOCTOR: "It's time."

---

## CHAPTER 4 — THE BIRTH
**~4 min · Directed scene. The player keeps exactly one verb: hold.**

**07:00, Tuesday.** You are beside her head. **Hold [E].** The pushing starts —
and it lasts three hours. In game: the room, the holding, then a time card:
**10:02.** The room is loud in a way
the game has never been — voices overlapping, instructions, her.

More staff come in. Someone in scrubs ends up standing **between the camera and the bed.**
You see backs. Shoulders. You hear everything and see nothing.

*(What is happening on the other side of those backs — the third-degree tear — is never
shown, never named. Not until a sheet of paper at the end of the game.)*

Then —

**A baby crying.**

Every other sound drops out for three full seconds. Just the cry.

They bring the baby to you, wrapped tight. One interaction, the whole screen:

> **[E] Look at them.**

One breath of pure joy. The only one in the act. And behind you, at the bed —
movement. Too much movement. Fast hands. A pole being wheeled.

> NURSE: "You need to step outside now."

Firm hands on your shoulder. The corridor. The door closes.

**Click.**

The beep is gone. You can't hear anything through the door. That silence is the act break.

---

# ACT III — THE INFORMATION
*A thriller where the monster is a sentence: "Everything's fine."*

## CHAPTER 5 — THE CORRIDOR
**~10 min · Outside the delivery room. Night. The hospital begins to grow.**

**Objective: "Wait for your wife."** A bench. The wall clock. Time passes in cuts.

Ask a nurse:
> NURSE 1: "Everything's fine. She's got a bit of a fever, we're keeping an eye on it.
> She'll be out in about an hour."

Notebook: `21:10 — "A bit of a fever." — "About an hour."` **Dose one.**

An hour passes. A different nurse:
> NURSE 2: "Maybe two more hours."

Notebook stacks the entries. The player reads the ladder:
> `21:10 — "About an hour."`
> `22:20 — "Maybe two more."`

No one acknowledges the contradiction. The notebook just holds it up.

**The geometry starts.** Never announced:
- The corridor is a few doors longer than it was.
- The exit sign is further than you remember.
- The wall clock disagrees with the HUD clock by 25 minutes. Neither is marked wrong.
- A door that was on the left is now on the right.

**The phone becomes an item.** You can call her. Any time. As many times as you want.
It rings out. Rings out. Rings out. **None of this is scripted — the redialing is
the player's own despair, authored by them.** The game counts silently.

Doors: `STAFF ONLY` · `WAIT OUTSIDE` · `DELIVERY 2 — locked`.

One door is unlocked. The wrong one. Inside: **another family. Balloons. A grandmother
crying with joy. Phones out, photos.** They turn and look at you. You close the door yourself.

**Objective decays: "Wait." → "Wait…" → "…"**

---

## CHAPTER 6 — THE CALL
**~3 min**

The phone rings. It's not her.

> DOCTOR: "Have you seen the baby yet?"

Choices — the game's second conversation with a menu:
- "Yes."
- "No."
- **"Where is my wife?"**

Whichever you pick:

> DOCTOR: "Go see the baby. Someone will take you up. Everything's fi—"

**He hangs up mid-word.** The dialogue box cuts with him.

Notebook: `23:05 — He didn't answer the question.`

A nurse appears: *"Follow me."* The one walk in the game where you are led:
long corridor, elevator, another floor. She doesn't explain anything. Door:

**NICU.**

---

## CHAPTER 7 — THE BABY
**~5 min · The NICU. Everything changes: sound, light, temperature.**

First, the airlock. **The scrub-in ritual: hold [E] to wash your hands — a real 20 seconds.**
Timed. Mandatory. No skipping. *(Plant the ritual now. By Act IV the player will find it
calming — the only procedure in the hospital with clear rules that work.)*

Inside: a different world. Soft alarms, ventilator rhythm, warmer hum. Dim, warm light —
the first warm light since the prologue. Rows of incubators.

Yours.

Wires. A cannula. An IV line thinner than a phone cable.

> NICU NURSE *(the gentle voice — NICU staff are the only people in this hospital
> who explain things)*: "Baby's stable. We started antibiotics — with the waters
> breaking early there was a risk of infection. Baby's doing well."

*(Notice: the baby's caretakers talk to you. The wife's don't. Never comment on it.)*

One interaction, alone at the glass:

> **[E] Touch the glass.**

No dialogue tree. A long beat. Then a single line appears — not a choice,
just the only sentence the player has left:

> **"Where is my wife?"**

Cut.

---

## CHAPTER 8 — A LITTLE OXYGEN
**~6 min · The doctor finds you. You never find him. Remember that rule.**

Corridor outside the NICU:

> DOCTOR: "She needs a little oxygen. Just to help her breathe. It's under control.
> Listen — go home. Rest for an hour, bring her things. I'll call you."

Notebook: `00:40 — "A little oxygen."` **Dose two.** The ladder now reads:
fever → oxygen. The player can scroll it. The player *will* scroll it.

**Outside.** First time in ~28 hours. And the world is obscenely normal:
cars. A bus. Streetlights. **Two people laughing at a bus stop.** Warm night air.
The player walks to the car through a world that doesn't know.

Driving. Optional: turn on the radio — a pop song, grotesquely cheerful. Turn it off.

Then the phone. **Pull over to answer** (the game forces the stop — one small
honest mechanic):

> DOCTOR: "You need to come back. Now. She needs a blood transfusion
> and we need your signature."
> PLAYER: "What's happening? Is she—"
> DOCTOR: "Everything's fine. But come now."

*"Everything's fine. But come now."* — the phrase at its most obscene.
**The music becomes loud for the first time in the game.**

**Objective, full screen for one beat: TURN AROUND.**

---

## CHAPTER 9 — THE SIGNATURE
**~5 min · The hospital at its largest. The set-piece.**

You run. The corridors are the longest they will ever be — the geometry at maximum.
Every sign is a blur. Every door is a wrong door. *(The player has no information;
the hospital has no map.)*

Then a desk, a clipboard, a pen.

**"CONSENT FOR TRANSFUSION OF BLOOD PRODUCTS."**

Every sign in this hospital is illegible. **This form is crystal clear.** Every field
explained, patiently: *sign here, initial here.* The bureaucracy works perfectly.
It's the only thing that does.

You can ask questions first:
- "What happened?" → DOCTOR: "She's lost **a lot** of blood."
  *(The word "little" is gone. Its absence is the loudest thing in the scene.
  No sting. No zoom. Let the player's own training do it.)*
- "Is she in danger?" → "We're doing everything."
- "Can I see her?" → "After. Sign first."

**The set-piece: hold [E] to sign.**
Your name writes itself letter by letter, slowly — a full six seconds.
Every sound in the world drops out except the pen scratch.
Release the button: it stops mid-letter. You have to hold it to the end.
There is no "refuse" option. **It is the only real power the player is ever given,
and it is this: authorizing an act on her body, knowing nothing.**

After. The player calls her — and this time **it connects.**
*(If they've been redialing since Chapter 5, this is the payoff of every unanswered ring.)*

Breathing. A mask sound. Then, slurred, faint, from very far away:

> WIFE: "I can't… talk right now. I'm on… oxygen. …It's fine."

Click.

**She said the phrase.** Notebook: `02:1? — she sounds far away.`
*(The timestamp is corrupted. The notebook — the one honest system in the game —
is losing its grip too.)*

---

## CHAPTER 10 — THE DOOR
**~3 min**

They let you approach — or you slip in; it's deliberately unclear. You see her:

Pale. Oxygen mask. People around the bed, working. A dark bag hanging on the pole —
the camera never looks at it directly.

She sees you. She tries to lift her hand.

Two steps toward her — **a doctor steps into the frame,** filling it:

> "You need to step outside."

The door closes on her looking at you.
**The exact mirror of Chapter 4's door.** Same sound. Same click.

**Objective: WAIT OUTSIDE.**

---

## CHAPTER 11 — FOUR HOURS
**~8 min · The strangest chapter. Almost nothing to do. That's the design.**

A chair. A corridor. A vending machine. A toilet. Your phone.

- **The clock lies.** Look at it: 40 minutes gone. Look again: 2 minutes.
  Sometimes it's slow. It is never caught in the act.
- **Walk anywhere far enough and you arrive back at the chair.** Never explained.
  The player is not sure if it happened or if they're just tired. Good. Neither was I.
- **The phone:** she doesn't answer anymore. The player can keep calling or stop.
  The game counts, silently, either way.
- **The other father.** Sits two chairs away. You don't speak — there is no dialogue
  option; the game refuses it. After a while a nurse comes: *"Mr—? You can come in."*
  He leaves. His empty chair stays in frame. You stay.
- **The cleaner.** 3 a.m., mopping. The only person in Act III who talks to you
  like a human being:
  > "First one? …It never goes how they tell you. She's in the right place.
  > This place is good at the bad stuff."
  One moment of warmth. It makes everything colder around it.
- **The ambience slowly crossfades into a baby crying** — somewhere, floors away —
  then back into ventilation hum. Was it yours? The game never answers.

Then, without ceremony:

> NURSE: "You can come in. We're moving her to the ward."

---

# ACT IV — AFTER
*Recovery, expressed as geometry. The world returns to its true size. Then goes smaller.*

## CHAPTER 12 — THE ROOM
**~4 min · Postnatal ward, deep night. Curtained bays. Quiet.**

Other mothers. And beside each bed — **a bassinet with a baby in it.** Small sounds:
a snuffle, a rustle, a lullaby hummed on the far side of the room.

Her bay. She's there. Grey-pale, whispering-weak. **But there.**

> **[E] Hold her hand.**

The same hold-button from the contractions. The player's hands remember. First touch
since the door in Chapter 4.

Beside her bed stands a bassinet. **Empty.**
No NPC comments. No camera push-in. It's just there, in frame, the whole scene.

> WIFE *(whisper)*: "Did you see the baby? …Tell me. The truth."

The player answers in fragments — pick any, all true:
`"Small." · "Beautiful." · "Full of wires." · "Doing well."`

She falls asleep in the middle of your fourth word.

**Objective: "Stay until she sleeps."** Then, softly: **"Go see the baby."**

The eight-hour rhythm begins.

---

## CHAPTER 13 — EVERY EIGHT HOURS
**~10 min · Days 1–3, as a loop that slowly heals.**

**The loop:** ward → corridor → elevator → **scrub-in (hold, 20 seconds)** → sit with
the baby → back. `08:00 — 16:00 — 00:00.`

- **The NICU route never changes.** Not by one tile. It is the fixed star of the whole
  game, and by now the player knows it by heart — that's the point. Knowing the way
  is what recovery feels like.
- **Everything else shrinks back to true size,** visit by visit, as real information
  finally arrives.
- **The doctor now appears with small good news** — the "a little" motif, inverted:
  > "Fever's down a little."
  > "She ate a little today."
  > "A little stronger every day."
  Small bad things have become small good things. The player feels the word heal.
- **The baby, visit by visit** (four incubator states, no bars, no UI — you just see it):
  wires → fewer wires → cannula only → nothing.
- **Her, visit by visit:**
  - Day 2: she comes with you — **you push the wheelchair.** A new verb. For the first
    time since Act II, your hands carry her somewhere.
  - Day 3: she walks. Slow, leaning on you, pain she doesn't mention *(sitting is hard;
    the tear — still unnamed; the player only sees a cushion you learn to bring her)*.
  - Day 3, in the NICU: **she holds the baby against her skin.** You watch.
    Your only interaction: **[E] Sit beside them.** That's the whole verb. It's enough.
- *"Everything's fine" has not been said by anyone since Chapter 10. The player won't
  consciously notice. Their body will.*

---

## CHAPTER 14 — HOME (WITHOUT)
**~5 min · Her discharge. Not the baby's.**

> NURSE: "Baby stays a few more days. It's completely normal."
> *(Notebook, dryly: `"Normal."`)*

The drive home, the two of you. The back seat is empty — **the car seat was never
installed. The box is still by the door at home. You said you had time.**

Same front door. Same camera angle as the prologue. Same house sounds. No music.

- The nursery is **exactly as you left it** — the mobile you hung, the bear you placed.
  Untouched air.
- **The dog checks her, then searches the rooms, one by one, and finds nothing.**
  No comment. The dog does the scene's whole work.
- She sleeps early, carefully, on her side. Pills on the nightstand, times written
  on the box.
- You stand in the nursery doorway. **Objective: "…"**

Then the compressed loop — **four days in montage:** windshield at dawn, at noon,
at night; the drive you now know like the NICU corridor; scrub-in; fewer wires;
home; pills; her walking a little further each day — to the car, then into the NICU,
then to the incubator without your arm.

Day 4, morning. The phone rings. **You flinch** — the game has conditioned you too.

> NICU NURSE: "Good news. You can take the baby home today."

**Final task before leaving the house — install the car seat.**
The box from the prologue. A real, deliberate interaction: hold, click, strap, check.
**The counter-signature.** The second and last time the game slows your hands down —
but this one you chose, and this one you understand completely.

---

## CHAPTER 15 — THE FOURTH DAY
**~5 min · Daylight. The whole hospital, one last time — at human size.**

The NICU. The last scrub-in. **Hold [E], 20 seconds.** *(By now the ritual is almost
dear. Let the player feel that they might miss it.)*

The baby: no wires. Dressed — **in the onesie folded into the bag in the prologue.**

Then the long carry: **out through the entire geography that terrorized you,**
now at normal size, in daylight, full of ordinary people. Past the ward. Past the
chair — *(someone else is sitting in it)* — past the delivery room door. Nobody stops
you. The doors that said WAIT OUTSIDE just… stand there. Out.

Home. The same entrance. The same camera. The prologue's exact framing —
plus a car seat in your hand.

- **The dog comes and sniffs the baby.** Long. Thorough. Tail starts.
- She sits — **carefully, with a wince she tries to hide.** She's still on antibiotics;
  it still hurts. On the table: **her pills and a baby bottle, side by side.**
  One table, both truths. This is what "fine" actually looks like.
- **Optional interactable — the discharge papers on the table.** If the player reads them,
  they get the game's only complete explanation, in dry clinical English:
  > *…third-degree perineal tear… postpartum haemorrhage… one unit transfused…
  > neonatal antibiotic course completed…*
  Nobody ever told you. You learn it at the end, from paper, the way it actually happens.
  And if you don't want to read it — you don't have to.
- **You hang the keys on the hook.** Same spot as the prologue. Same little sound.

**Objective: "Take care of your baby."**

> **[E]**

The objective fades out. No new one appears. There is only the sound of
**the baby breathing.** Hold on the room. Ten seconds. No music.

Black.

Then, white on black, the first true thing anyone has said since Chapter 1:

# EVERYTHING IS FINE

*(Personal build: after the title, real photographs, if wanted. Public build:
credits over the sound of breathing.)*

---

## Why this stays a game

The user asked for realism — but it's a game, and it plays like one:

| System | What the player actually does |
|---|---|
| **Helping verbs** (Act II) | Water, hold-through-contractions, stories, walking her — real inputs with visible effect, then taken away |
| **The notebook** | Auto-logging quotes + timestamps; the player scrolls the contradiction ladder themselves |
| **The phone** | Free-form redial; despair authored by the player, paid off in Ch 9 |
| **The geometry** | Corridors lengthen/shrink with information; the chair loop; the fixed NICU route |
| **Rituals** | 20-second scrub-in, the hold-to-sign, the car-seat install — the game slows your hands at its three biggest moments |
| **Montage pacing** | 22 hours and 4 days compressed into playable slices; no real-time waiting beyond deliberate minutes |
| **The fake choice** | "Okay?" — offered once, changes nothing, and that's the honest design |

## Builds & localization

- **Language:** English primary (this script). All strings externalized
  (`en.json` / `el.json`) — the Greek personal edition is a translation file,
  not a fork. Greek pixel font required for `el`.
- **`VITE_EDITION=personal`** — real names, real photos in the epilogue, no content card.
- **`VITE_EDITION=public`** — placeholder names, content warning card up front
  (*childbirth complications, medical trauma, infant intensive care*),
  "skip scene" offer on Chapter 4, credits epilogue.

## Chapter → asset dependencies (build order hint)

Vertical slice = **Prologue → Ch 1 → Ch 2 (short) → Ch 4's door close → Ch 5.**
Everything the game is, in 15 minutes: warmth, normalcy, helping that works,
the door, the corridor that grows. If the slice works, the rest is labor.
