# Fantasy Town v0.0.0.5

A neon-lit pixel-art life/farming sim. Plain HTML5 canvas, no build step, all art drawn in code.
Open `index.html` in a browser (or serve the folder with `python3 -m http.server`).

## Districts
1 Resort Home (your house: sleep & save) · 2 Sky Towers (neon shards) · 3 Scrap Yard (scrap, ore) · 4 Garden Dome (farm plot, trees for wood) · 5 Central Plaza (NPCs, holo fountain) · 6 Neon Market (buy seeds, sell goods) · 7 Residences · 8 Marina (shells, fishing from piers)

## Controls
- Move: WASD / arrow keys (Shift to run)
- Act / talk / use tool: E, Space or Enter (on the tile you're facing)
- Select tool: 1-7, Q/Tab to cycle, or click the hotbar
- Map: M
- Touch: on-screen D-pad, A = act, B = cycle tool, MAP button

## Farming
Hoe (till) → Seed (plant) → Water Can (water daily) → sleep. A watered crop grows one stage each night.
Turnip 3 days, Glowberry 4, Starfruit 6. Use Act on a ripe crop to harvest.
Scrap/ore/shells/neon respawn each morning. Day runs 6 AM to 2 AM; stay up past 2 AM and you pass out.
Progress saves to localStorage when you sleep (and every 30 s).

Debug URL params: `?t=22` (start hour), `?map` (open map), `?touch` (force touch UI).
