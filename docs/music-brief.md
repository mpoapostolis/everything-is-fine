# EVERYTHING IS FINE — Music & Sound Brief (for Gemini / any AI music tool)

> Δώσε στο Gemini το κάθε prompt όπως είναι (αγγλικά). Όταν πάρεις το αρχείο,
> ρίξ' το στο `assets-raw/audio/` με το όνομα που γράφει το κάθε τμήμα και πες μου —
> το κουμπώνω αμέσως στη σωστή σκηνή.

**The game, in one paragraph (give this to Gemini as context first):**
A quiet 2D pixel-art narrative game based on a true story. A husband and his
pregnant wife go for a routine check-up on a Monday morning. Her waters break at
noon. She labours all night in hospital; near dawn the doctor threatens a
caesarean, then gives it one hour — the baby descends, she pushes from 07:00 and
the baby is born at 10:02. Then the real nightmare: the mother hemorrhages
(third-degree tear, transfusion), the father is kept outside locked doors for
hours while everyone tells him "everything's fine". The baby spends 4 days in
the NICU on antibiotics. In the end, everyone comes home. The whole game is
restrained, intimate, never melodramatic. Nothing graphic is ever shown.

**Technical requirements for every track:** instrumental only, no vocals,
seamlessly loopable, 60–120 seconds, quiet mix with headroom (this plays under
dialogue), MP3 or OGG.

---

## MUSIC (one track per scene)

### 1. `prologue.mp3` — Home, the last easy morning
> Warm intimate solo piano with soft felt texture, slow and unhurried, morning
> light through a window, domestic tenderness, a young couple's small apartment,
> gentle and hopeful with one note of quiet anticipation. Loopable, 90 seconds.

### 2. `checkup.mp3` — An ordinary hospital day
> Light neutral ambient with soft mallets and warm pads, an ordinary busy
> morning errand, harmless and civil, waiting-room calm, nothing wrong yet.
> Loopable, 90 seconds.

### 3. `waters.mp3` — The waters break (noon, at home)
> Sudden restrained urgency: a low pulsing heartbeat-like synth bass, sparse
> staccato piano notes, controlled alarm — not action music, the dread of a
> plan collapsing. Builds slightly but never explodes. Loopable, 60 seconds.

### 4. `delivery.mp3` — The long night in the delivery room
> Exhausted tender ambient: slow warm drones, distant soft piano every few
> bars, the feeling of holding someone's hand at 3 a.m. under fluorescent
> light, love worn thin by hours, patient and heavy-lidded. Loopable, 120 seconds.

### 5. `caesarean.mp3` — "Give it an hour" (optional, the night's lowest point)
> A single sustained string drone with a faint slow pulse, held breath,
> hospital corridor at 6 a.m., hope and fear in the same chord. Very sparse.
> Loopable, 60 seconds.

### 6. `corridor.mp3` — Locked doors, "everything's fine"
> Sparse dark ambient dread: hollow air, distant metallic resonance, a corridor
> that is longer than it should be, unanswered questions, low sub rumble,
> no melody at all. Unsettling but quiet. Loopable, 120 seconds.

### 7. `nicu.mp3` — The baby behind glass (for the next chapters)
> Fragile warm ambient heard as if through incubator glass: soft filtered
> music box or celesta, slow breathing rhythm, ventilator hush, tenderness
> and machinery together, protective and small. Loopable, 90 seconds.

### 8. `ward.mp3` — She survived; recovery ward at night (next chapters)
> Gentle nocturne for piano and faint strings, dim ward light, whispered
> relief mixed with exhaustion, other babies sleeping nearby, quiet gratitude
> with an ache in it. Loopable, 90 seconds.

### 9. `home-without.mp3` — Home without the baby (next chapters)
> The prologue's warm piano theme made hollow: same intimacy but emptier,
> longer silences between phrases, a nursery nobody sleeps in yet, missing
> someone who is alive and elsewhere. Loopable, 90 seconds.

### 10. `ending.mp3` — The fourth day; everyone home
> Warm resolving piano with soft strings, morning again, fragile happy ending
> that still aches, a family of three and a dog, tears that are mostly relief.
> Ends calmly; loopable, 120 seconds.

---

## SOUND EFFECTS (short one-shots; if Gemini can't do SFX, record these on a phone)

| File | Prompt / what to record |
|---|---|
| `sfx-baby-cry.mp3` | **Best: your own baby's recording.** Otherwise: a newborn's first cry, 3–5 seconds, close and raw, no background. |
| `sfx-heart-monitor.mp3` | A single soft hospital CTG monitor beep, short, gentle sine tone, not alarming. One beep only (the game repeats it). |
| `sfx-door-heavy.mp3` | A heavy hospital double door closing with a latch click, 1 second, final-sounding. |
| `sfx-phone-ring.mp3` | A phone ring-back tone as heard by the caller, two rings, slightly distant. |
| `sfx-pen-paper.mp3` | A pen scratching a signature on paper on a clipboard, 4 seconds (for the transfusion consent scene). |
| `sfx-scrub-water.mp3` | Hands being washed thoroughly in a metal sink, 5 seconds (the NICU scrub-in ritual). |
| `sfx-car-drive.mp3` | Interior of a car driving at night, engine hum, 10 seconds loopable. |
| `sfx-dog-sniff.mp3` | A dog sniffing curiously then a small happy tail-thump, 2 seconds. |

---

## Πώς τα κουμπώνω (μην το κάνεις εσύ, απλώς φέρε τα αρχεία)

1. Ρίξε ό,τι έφτιαξες στο `assets-raw/audio/` με τα ονόματα του πίνακα.
2. Πες μου «έβαλα ήχους».
3. Τα περνάω στο `public/assets/audio/`, τα δηλώνω στο `src/engine/audio.ts`,
   και αλλάζω τα `setMusic(...)` της κάθε σκηνής. Πέντε λεπτά δουλειά.
