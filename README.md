# Fantasy Town v0.0.1.6
Family-friendly isometric condo-manager life sim set in the small town of Lumen Town. Plain HTML5 canvas, no build step: open index.html.

## Town
Fantasy Condo, City Park (pond, benches), Town Plaza (fountain, Mayor Lumen), Cafe, Restaurant, Furniture Shop, Studio. MAP shows the town, tenant locations; tap a place to go, tap a tenant bubble to follow.

## Loop
- Gold comes from rent, collected each morning (sleep in the office bed). Rent = applicant's offer × happiness × friendship bonus.
- ADVERTISE: Front desk → Post ad (20g). Next morning 3 applicants appear, each with portrait, personality, liked themes, favourite furniture, job and rent offer. Choose one; the others leave.
- Condo tower: ground floor office + front desk, tenant floors above; Renovate (150g × floor) to add a floor overnight (max 6).
- Furniture Shop: buy furniture into storage; DECOR inside a room to place/move. Tenants' happiness rises with liked themes (Cozy/Nature/Tech/Books/Aqua/Fun) and their favourite item.
- Schedules: home in the morning, work (Studio/Cafe/Restaurant/Furniture Shop) or hangouts (park/plaza/cafe) by day, lunch at cafe/restaurant, evening hangout, home at 8 PM. They walk the streets between places.
- Tap a tenant → card with FOLLOW (camera tracks them), TALK, HANG OUT. Talking (+1/day) and hanging out (+3/day) raise friendship; each level unlocks one of 3 friendship scenes per tenant.

## Apartments (v0.0.1.0)
- Each tenant unit is an 18×12 apartment split by interior walls/doorways into Kitchen, Bedroom, Bathroom and Living Room (bright Habbo-style walls, white tile / wood floors).
- A unit can only be rented with a Toilet, Bed, Stove and Fridge. Furniture must go in the right room (toilet in bathroom, stove in kitchen...). Wall decor goes on tiles touching the back walls.
- 60+ furniture items in 5 themes (Modern, Cozy Wood, Neon Gamer, Beach, Luxury) plus gym/safety props; tenants like 2 themes and one favourite item. Completing each room's kit (e.g. kitchen: stove, fridge, sink, counter, dining) adds happiness.
- The manager office is a full lobby (front desk, waiting chairs, filing cabinet, notice board, water cooler, extinguisher) + manager bedroom + washroom.

## Controls
Tap/click to walk; WASD/arrows, E use, T talk, F follow, M map, B decor, Esc back. Optional d-pad in settings. Landscape phone first (rotate overlay, fullscreen + landscape lock).
Save: localStorage `fantasytown_save_v8` (older saves reset with +150g).

## Test
`/workspace/tools/pwvenv/bin/python test.py` (headless Playwright, writes screenshot-*.png).

## v0.0.1.6
- New tenant **Ares** (night-club door supervisor, £13.50/h, 9pm–3am), guaranteed first applicant; daily gym visits, loves gym furniture (fav: dumbbell rack); dialogue per friendship level, home/furniture/rent reactions.
- Night Club (neon sign, red carpet, velvet rope) and Lumen Gym added to town.
- Currency is now £ (rent ≈ £700–£950/mo). Debug sheet: ares-sheet.html.
