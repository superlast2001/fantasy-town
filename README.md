# Fantasy Town v0.0.0.6

A neon pixel-art life/farming sim where **you build the village**. Plain HTML5 canvas (`index.html`, `art.js`, `game.js`), no build step, all art drawn in code.
Open `index.html` in a browser or serve with `python3 -m http.server`. Phones: **play in landscape**. The first tap asks for fullscreen and landscape lock where the browser allows it, and holding the phone upright shows a "Rotate your phone" overlay.

## The world (6 connected areas)
| Area | Region | Resources / features |
|---|---|---|
| Hearth Village | start, the only place you can build | tent home, river, a few trees |
| Whisper Forest | walk east from the village | wood, glow mushrooms, **broken bridge** (repair: 15 wood + 3 ore) |
| Rust Badlands | across the bridge | scrap, ore |
| Vapor Mine | north of Badlands | ore, neon, **ancient portal** (light it: 8 neon, 6 shell, 5 ore) |
| Shell Isle | by boat | shells, fishing from piers |
| Neon City | by train or portal | market pays +50%, Starfruit seeds, NPCs |

Route types (same legend as the world map): Walking, Blocked, Magic, Bus, Train, Boat, Cable Car.
Fast routes open when you build their station: Bus Stop → Badlands, Cable Car → Mine, Boat Dock → Shell Isle, Train Station → Neon City. The portal opens Mine ↔ Neon City.

## Building (B / BUILD button, only in Hearth Village)
Neon Path, Street Lamp, Glow Flowers, Fence, Farm Plot (soil), Shop Stall (selling + seeds, Mira moves in), Villager Cottage (a new villager each),
Workshop (tool upgrades, Bolt moves in), Boat Dock (place on water touching the shore; fishing + boat, Old Coral moves in), Bus Stop, Cable Car Station, Train Station, Holo Fountain.
Upgrade your home (Tent → Cottage → Neon Manor) from the home door menu.

## Controls
- Move: WASD / arrows (Shift to run). Walk off a glowing edge exit to change area.
- Act / talk / use / place: E, Space, Enter (on the faced tile)
- Tools: 1-7, Q/Tab to cycle, or click the hotbar. In build mode Q/X = next item, Z = previous, or click the palette.
- B: build mode · M: world map (click or press a number to fast-travel)
- Touch: D-pad (left thumb); A = act/place, B = cycle tool or building, BUILD, MAP (right thumb)

## Farming
Hoe → Seed → Water Can → sleep. Watered crops grow one stage per night (Turnip 3 days, Glowberry 4, Starfruit 6). Resources respawn every morning.
The day runs 6 AM–2 AM. Sleep at the home door to save. The game also autosaves every 30 s.
Saves use the key `fantasytown_save_v6`. A v0.0.0.5 save is not migrated: you start a fresh village with a +100g bonus.

Debug URL params: `?t=21` start hour, `?map` open map, `?touch` force touch UI. `test.py` is the Playwright smoke test.
