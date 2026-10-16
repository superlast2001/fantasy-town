# Fantasy Town v0.0.0.7
Family-friendly isometric life/farming/condo sim. Plain HTML5 canvas, no build step: open index.html.

## Play
- Tap/click to walk (pathfinding); tapping a target walks there and acts (till/plant/water/harvest, gather, fish, talk, enter).
- Keys: WASD/arrows move, E/Space use, Q tool, B build, M map, Esc back. Optional d-pad in Settings (gear).
- TALK button / tags open anime-portrait dialogue (Skip>> / Hide / Next >).
- Fantasy Condo: ground-floor manager office + front desk (post ad 20g, register applicant), tenant floors above.
  Renovate (120g x n, wood, ore) opens the next floor overnight. Each floor = one tenant; rent = 20 + comfort x3, paid when you sleep (office bed).
- Decor mode in rooms: pick furniture, tap to preview, tap again to place; tap placed furniture to move it.
- World map (MAP) with routes: walk, bus, train, boat, cable car, magic; fast travel once unlocked.
- Landscape phone first: rotate overlay, fullscreen + landscape lock on first tap.
- Save: localStorage `fantasytown_save_v7` (older saves reset with +150g bonus).

## Test
`/workspace/tools/pwvenv/bin/python test.py` (headless Playwright, writes screenshot-*.png).
