
'use strict';
// Lumen Town v0.0.2.4
// Lobby start + instant teleport travel + developer tools.
// Existing game systems and data structures are retained.

const door = id => {
  const b = BLDS.find(q => q.id == id);
  return [b.door[0], b.door[1] + 1];
};

const TRAVEL = [
  ['condo', '🏢', 'Back to Condo', 'Lumen Residences lobby'],
  ['gym', '🏋', 'Lumen Gym', "Ares' workplace"],
  ['cafe', '☕', 'Cafe', 'Cocoa & treats'],
  ['restaurant', '🍜', 'Restaurant', 'Noodles & dinner'],
  ['park', '🌳', 'City Park', 'Fresh air'],
  ['fshop', '🛋', 'Furniture Shop', 'Buy furniture'],
  ['club', '🪩', 'Night Club', 'Open 9 PM – 3 AM'],
  ['street', '🛣', 'Town Street', 'Walk around town']
];

function travelTo(id) {
  closeMenu();
  showMap = false;
  showCondo = false;
  showApps = false;

  if (decor) decor = false;

  follow = null;
  fade = 0.8;
  sfx(660);

  if (id === 'condo') {
    enterRoom('office');
  } else if (id === 'gym') {
    enterGym();
  } else if (id === 'park') {
    goArea('town', [7, 17]);
  } else if (id === 'street') {
    goArea('town', [17, 16]);
  } else {
    goArea('town', door(id));
  }

  save(1);

  toast(
    '✨ ' +
    (TRAVEL.find(t => t[0] === id) || [,, id])[2]
  );
}

window.travelTo = travelTo;

// Teleport menu: choose a destination instead of navigating the map.
window.travelMenu = function () {
  const here = area.room === 'office'
    ? 'condo'
    : area.room === 'gym'
      ? 'gym'
      : null;

  const destinations = TRAVEL.map(([id, icon, name, description]) => `
    <button class="tp${id === here ? ' here' : ''}"
      onclick="travelTo('${id}')">
      <span class="ti">${icon}</span>
      <b>${name}</b>
      <small>${id === here ? 'You are here' : description}</small>
    </button>
  `).join('');

  openMenu(`
    <h3>🚪 WHERE TO?</h3>
    <p>Choose a destination to teleport instantly.</p>
    <div class="tlist">${destinations}</div>
    ${area.room === 'office'
      ? `<button onclick="closeMenu();back()">
          🚶 Walk out onto the street instead
         </button>`
      : ''}
  `);

  menuEl.scrollTop = 0;
};

// Floating TRAVEL button.
const tvb = document.createElement('div');
tvb.id = 'btravel';
tvb.className = 'tb pill';
tvb.textContent = '🧭 TRAVEL';
document.body.appendChild(tvb);

tvb.addEventListener('pointerdown', e => {
  e.preventDefault();
  e.stopPropagation();
  travelMenu();
});

// Developer mode.
let DEV = localStorage.getItem('ft_dev') === '1';
let DBG = localStorage.getItem('ft_dbg') === '1';

const dvb = document.createElement('div');
dvb.id = 'bdev';
dvb.className = 'tb pill';
dvb.textContent = '🛠 DEV';
document.body.appendChild(dvb);

dvb.addEventListener('pointerdown', e => {
  e.preventDefault();
  e.stopPropagation();
  devPanel();
});

const ov = document.createElement('div');
ov.id = 'dbgov';
document.body.appendChild(ov);

function applyDev() {
  dvb.style.display = DEV ? '' : 'none';
  ov.style.display = DEV && DBG ? 'block' : 'none';
}

applyDev();

window.toggleDev = () => {
  DEV = !DEV;
  localStorage.setItem('ft_dev', DEV ? '1' : '0');
  applyDev();
  toast(DEV ? '🛠 Developer mode ON' : 'Developer mode OFF');
  settings();
};

const originalSettingsV23 = settings;

settings = function () {
  originalSettingsV23();

  const b = document.createElement('button');
  b.textContent = '🛠 Developer mode: ' + (DEV ? 'ON' : 'OFF');
  b.onclick = toggleDev;

  const closeButton = menuEl.querySelector('button.x');
  menuEl.insertBefore(b, closeButton);
};

window.devDo = (k, v) => {
  const c = S.condo;

  if (k === 'gold') {
    S.gold += v;
    toast('+' + money(v));

  } else if (k === 'rel') {
    const f = fr('Ares');
    f.p = v === 6 ? REL_P[5] : REL_P[v];
    f.dated = v >= 3 ? 1 : 0;
    f.married = v === 5 ? 1 : 0;

    if (v === 6) {
      f.dated = 1;
      f.married = 0;
    }

    toast(
      'Ares → ' +
      (v === 6 ? 'max hearts (ready to propose)' : REL[v])
    );

  } else if (k === 'hour') {
    S.min += 60;
    syncTenants(true);
    toast('+1 hour');

  } else if (k === 'day') {
    closeMenu();
    sleep();
    return;

  } else if (k === 'floors') {
    let n = 0;

    while (c.floors < MAXF) {
      c.floors++;
      c.tenants.push(null);
      S.rooms['f' + c.floors] = {
        lay: 'unit',
        furn: starterFurn()
      };
      n++;
    }

    toast(n ? `Unlocked ${n} floors` : 'All floors already open');

  } else if (k === 'furn') {
    FURNLIST.forEach(q => {
      if (!FURN[q].fixed) {
        S.finv[q] = (S.finv[q] || 0) + v;
      }
    });

    toast(`+${v} of every furniture item`);

  } else if (k === 'dbg') {
    DBG = !DBG;
    localStorage.setItem('ft_dbg', DBG ? '1' : '0');
    applyDev();

  } else if (k === 'tp') {
    fade = 0.8;
    closeMenu();

    if (v === 'office' || (v[0] === 'f' && S.rooms[v])) {
      enterRoom(v);
    } else {
      travelTo(v);
    }

    save(1);
    return;
  }

  save(1);
  devPanel();
};

window.devPanel = function () {
  const c = S.condo;

  const B = (k, v, label) =>
    `<button onclick="devDo('${k}',${
      typeof v === 'string' ? `'${v}'` : v
    })">${label}</button>`;

  let h = `
    <h3>🛠 DEVELOPER PANEL</h3>
    <p>
      Day ${S.day} · ${money(S.gold)} ·
      Ares ${REL[frLv('Ares')]} (♥ ${fr('Ares').p})
    </p>
    <b>Teleport</b>
    <div class="dgrid">
  `;

  h += TRAVEL
    .map(([id, icon, name]) => B('tp', id, icon + ' ' + name))
    .join('');

  h += B('tp', 'office', '🛎 Lobby / Office');

  h += Array.from({ length: c.floors }, (_, i) =>
    B(
      'tp',
      'f' + (i + 1),
      `🚪 Unit ${i + 1}${c.tenants[i] ? ' · ' + c.tenants[i] : ''}`
    )
  ).join('');

  h += `
    </div>
    <b>Money</b>
    <div class="dgrid">
      ${B('gold', 100, '+ £100')}
      ${B('gold', 1000, '+ £1,000')}
    </div>
    <b>Ares relationship</b>
    <div class="dgrid">
  `;

  h += REL.map((r, i) =>
    B('rel', i, (frLv('Ares') === i ? '✅ ' : '') + r)
  ).join('');

  h += B('rel', 6, '💍 Max hearts (propose-ready)');

  h += `
    </div>
    <b>Time</b>
    <div class="dgrid">
      ${B('hour', 0, '⏩ +1 hour')}
      ${B('day', 0, '🌅 Next day')}
    </div>
    <b>World</b>
    <div class="dgrid">
      ${B('floors', 0, `🏢 Unlock all floors (${c.floors}/${MAXF})`)}
      ${B('furn', 3, '🛋 +3 of every furniture')}
      ${B('dbg', 0, '📊 FPS / debug overlay: ' + (DBG ? 'ON' : 'OFF'))}
    </div>
  `;

  openMenu(h);
  menuEl.scrollTop = 0;
};

// Start in the condo lobby instead of the outdoor town.
function startInLobby() {
  try {
    if (typeof enterRoom === 'function') {
      enterRoom('office');
    }
  } catch (error) {
    console.error('Could not start in the lobby:', error);
  }
}

if (document.readyState === 'complete') {
  setTimeout(startInLobby, 700);
} else {
  window.addEventListener(
    'load',
    () => setTimeout(startInLobby, 700),
    { once: true }
  );
}

// FPS / debug overlay.
let fN = 0;
let fT = performance.now();
let fps = 0;

(function tick(now) {
  fN++;

  if (now - fT >= 500) {
    fps = Math.round(fN * 1000 / (now - fT));
    fN = 0;
    fT = now;

    if (DEV && DBG) {
      ov.textContent =
        `FPS ${fps} · ${area ? area.id : ''} · ` +
        `tile ${Math.floor(ptx())},${Math.floor(pty())} · ` +
        `${String(Math.floor(S.min / 60) % 24).padStart(2, '0')}:` +
        `${String(Math.floor(S.min % 60)).padStart(2, '0')} · ` +
        `Z ${Z.toFixed(2)} · npcs ${area ? area.npcs.length : 0} · ` +
        `Ares ${TN.Ares ? (TN.Ares.inRoom ? 'home' : TN.Ares.place) : '-'}`;
    }
  }

  requestAnimationFrame(tick);
})(performance.now());

// Hide floating buttons while dialogues or menus are open.
(function hide() {
  const m =
    document.body.classList.contains('modal') ||
    menuOpen() ||
    dlg.on;

  tvb.style.visibility = m ? 'hidden' : 'visible';
  dvb.style.visibility = m ? 'hidden' : 'visible';
  ov.style.visibility = menuOpen() ? 'hidden' : 'visible';

  requestAnimationFrame(hide);
})();
