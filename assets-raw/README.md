# Raw asset inventory

AI-generated source sheets. NOT game-ready: no uniform grid, opaque backgrounds.
A slicing pipeline will cut, clean, and pack these into atlases under `assets/`.

| File | Size | Contents | Notes |
|---|---|---|---|
| `player.png` | 1536×1024 | Player (dark hoodie). Rows 1–3: idle + walk, 4 directions. Row 4: phone-to-ear, standing sad, head-in-hands, chair, sitting slumped, reaching/pointing | Dark gradient bg — needs removal. Special poses map to Ch 5–11 |
| `wife-baby.png` | 1536×1024 | Wife (hospital gown). Rows 1–2: idle/walk 4-dir, hand on belly. Row 3: pain lean, in bed, in chair w/ IV pole, wheelchair holding baby. Row 4: standing, sitting hunched, baby in cot / incubator / bassinet | Grey gradient bg. Baby states = Ch 13 progression |
| `staff.png` | 1536×1024 | Row 1: doctor (scrub cap + coat) & NICU nurse. Row 2: nurse w/ bun, incl. pointing "follow me" pose. Row 3: receptionist at desk, suit person, security. Row 4: security poses | Green bg — easy chroma key |
| `hospital-tileset.png` | 1254×1254 | Floors, walls, double/single doors, elevator, EXIT/ICU/WARD A/WAIT HERE/ACCESS DENIED signs (correct spelling), counters, chairs, vending, clock, trolleys, WC door | Primary tileset. Light grey bg |
| `hospital-props.png` | 1536×1024 | Incubators (with baby), oxygen tanks, monitors, hospital bed, stool, chairs, drawer cart, landline phone, tissues, meds/pills, syringes, clock, wet-floor sign, bins, vending, wheelchair, small icons | Dark blue-grey bg. Correct sign spelling |
| `hospital-tileset-v1-spare.png` | 1024×1024 | Earlier draft of tileset | Spare parts only. Typos ("ACCESS TENIED", "ICLI") and blood-stained tiles — blood tiles are BANNED by design rule #4 |

## Still missing (generate with same palette/style — "muted blue-grey palette, chibi proportions"):

1. **Home interior** — wood floors, furniture, nursery (crib, mobile, stuffed bear), key hook, hospital bag, car-seat box. Needed for Prologue, Ch 14–15.
2. **The dog** — idle, walk, sniffing pose. Prologue, Ch 14 (searching the rooms), Ch 15.
3. **Exterior** — street, car (interior/exterior), driveway, bus stop. Ch 8, 14, 15.
4. **Player carrying the car seat** — one pose set. Ch 15's exit walk.
